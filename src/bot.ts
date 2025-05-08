import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  ChatInputCommandInteraction,
  SlashCommandBuilder
} from "discord.js";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

const commands = new Map<string, Command>();

client.once(Events.ClientReady, async (c) => {
  console.log(`✅ Bot logado como ${c.user.tag}`);

  // loading all commmands in src/commands/
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts"));

  const restCommands = [];

  console.log("👁️  Lendo todos os slash commands...");
  for (const file of commandFiles) {
    console.log(`  >  ➕ adicionando ${file} à lista de slash commands`);
    const filePath = path.join(commandsPath, file);
    const command: Command = (await import(filePath)).default;
    commands.set(command.data.name, command);
    restCommands.push(command.data.toJSON());
  }

  // register these commands
  const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
  try {
    console.log(`🔄 Registrando a lista de slash commands ao bot ${c.user.tag}...`);
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID!,
        process.env.DISCORD_GUILD_ID!
      ),
      { body: restCommands }
    );
    console.log(`✅ slash commands registrados ao bot ${c.user.tag} com sucesso!`);
  } catch (error) {
    console.error("❌ Erro ao registrar slash commands:", error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (command) await command.execute(interaction);
});

client.login(process.env.DISCORD_TOKEN);
