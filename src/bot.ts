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
import { env } from "./env";
import { pathToFileURL } from "url";

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

client.once(Events.ClientReady, async (c) => {
  Log.success(`✅ Bot logado como ${c.user.tag}`);

  // loading all commmands in src/commands/
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = getAllCommandFiles(commandsPath);

  const restCommands = [];

  Log.info("👁️  Lendo todos os slash commands...");
  for (const file of commandFiles) {
    Log.info(`  >  ➕ adicionando ${file} à lista de slash commands`);
    const filePath = file;
    const command: Command = (await import(pathToFileURL(filePath).href)).default;
    commands.set(command.data.name, command);
    restCommands.push(command.data.toJSON());
  }

  // register these commands
  const rest = new REST().setToken(env.DISCORD_TOKEN);
  try {
    Log.info(`🔄 Registrando a lista de slash commands ao bot ${c.user.tag}...`);
    await rest.put(
      Routes.applicationGuildCommands(
        env.DISCORD_CLIENT_ID,
        env.DISCORD_GUILD_ID
      ),
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