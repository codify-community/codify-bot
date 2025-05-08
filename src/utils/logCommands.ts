import { ChatInputCommandInteraction, TextChannel } from "discord.js";

export function logCommandUsage(interaction: ChatInputCommandInteraction) {
  const user = interaction.user.tag;
  const server = interaction.guild?.name || "DM";
  const channel = (interaction.channel?.type === 0 || interaction.channel?.type === 5 || interaction.channel?.type === 11)
    ? (interaction.channel as TextChannel).name
    : "Canal privado ou sem nome";
  const command = interaction.commandName;

  console.log(`[${server}] #${channel} - ${user} executou /${command}`);
}
