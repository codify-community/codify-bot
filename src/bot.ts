import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  ChatInputCommandInteraction,
  SlashCommandBuilder
} from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { Log } from "./utils/log";
import { execSync } from "node:child_process";
import db from "./lib/db";
import { env } from "./env";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

const commands = new Map<string, Command>();

/**
 * Recursively retrieves all .ts command files from the given directory and its subdirectories.
 * Useful for loading slash commands organized in nested folders like /commands/admin/. or /commands/whatever/*.ts
 */
function getAllCommandFiles(dir: string, files: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllCommandFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function createBotDatabase() {
  const guild = client.guilds.cache.get(env.DISCORD_GUILD_ID);

  if (!guild) {
    Log.error(`❌ Guild com ID ${env.DISCORD_GUILD_ID} não encontrada no cache.`);
    return;
  }

  Log.info(`⚙️ Criando database do servidor ${guild.name}`);

  try {
    await db.discordGuild.upsert({
      where: { id: guild.id },
      update: {
        name: guild.name,
        icon: guild.iconURL() ?? undefined
      },
      create: {
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL() ?? undefined,
        env: {
          create: {
            initialMoneyValue: 301.0000
          }
        }
      }
    });

    Log.database(`✅ Servidor sincronizado: ${guild.name}`);
  } catch (err) {
    Log.error(`❌ Erro ao sincronizar servidor ${guild.name}: ${err}`);
  }
}


function applyBotMigrations() {
  try {
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    Log.database("Migrations aplicadas com sucesso.");
  } catch (err) {
    Log.error(`Erro ao aplicar migrations: ${err}`);
  }
}

async function setupBotDatabase() {
  const guildId = env.DISCORD_GUILD_ID;

  const exists = await db.discordGuild.findUnique({
    where: { id: guildId }
  });

  if (exists) {
    Log.info("🔁 Servidor já registrado. Aplicando migrations...");
    applyBotMigrations();
  } else {
    Log.info("🆕 Servidor ainda não está no banco. Criando estrutura...");
    await createBotDatabase();
  }
}

client.once(Events.ClientReady, async (c) => {
  Log.success(`✅ Bot logado como ${c.user.tag}`);

  await setupBotDatabase();

  // loading all commmands in src/commands/
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = getAllCommandFiles(commandsPath);

  const restCommands = [];

  Log.info("👁️  Lendo todos os slash commands...");
  for (const file of commandFiles) {
    Log.info(`  >  ➕ adicionando ${file} à lista de slash commands`);
    const filePath = file;
    const command: Command = (await import(filePath)).default;
    commands.set(command.data.name, command);
    restCommands.push(command.data.toJSON());
  }

  // register these commands
  const rest = new REST().setToken(env.DISCORD_TOKEN);
  try {
    Log.info(`🔄 Registrando a lista de slash commands ao bot ${c.user.tag}...`);
    await rest.put(
      Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID),
      { body: restCommands }
    );
    Log.success(`✅ slash commands registrados ao bot ${c.user.tag} com sucesso!`);
  } catch (error) {
    Log.error(`❌ Erro ao registrar slash commands: ${error}`);
  }

  Log.success(`⚙️ ${c.user.tag} iniciado com sucesso!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (command) await command.execute(interaction);
});

client.login(env.DISCORD_TOKEN);