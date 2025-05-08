import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { logCommandUsage } from "../utils/logCommands";
import { BotColors, createEmbed } from "../utils/embeds/embedMessages";
import attach from "../../attach.json";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
  async execute(interaction: ChatInputCommandInteraction) {
    logCommandUsage(interaction);
    const embed = createEmbed({
      title: "🏓 Pong!",
      description: "Toma a bolinha de volta ~~(la ele)~~.",
      color: BotColors.success,
      image: attach.gifs.ping
    });

    await interaction.reply({ embeds: [embed] });
  },
};
