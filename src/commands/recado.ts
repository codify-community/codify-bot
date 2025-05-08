import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  User,
} from "discord.js";
import { logCommandUsage } from "../utils/logCommands";
import { createEmbed } from "../utils/embeds/embedMessages";

const respostas = [
  "vai trabalhar @! v4g4bund0",
  "só atrapalha a vida dos outros ein @",
  "@, nem o adm te aguenta mais",
  "@, fedido, vá se banhar",
  "@, vai te arr0mb4r pra lá doido",
  "@, que tal ficar na tua ein?",
  "@ vai dar 10zão no pix pro primeiro que marcar o adm e dizer que o ~~m~~ama",
];

export default {
  data: new SlashCommandBuilder()
    .setName("recado")
    .setDescription("Manda uma mensagem carinhosa pra alguém 😈")
    .addUserOption((option) =>
      option.setName("user").setDescription("Quem vai ser 'carinhosamente tratado bem'?").setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    logCommandUsage(interaction);

    const targetUser = interaction.options.getUser("user", true);
    const frase = respostas[Math.floor(Math.random() * respostas.length)];

    const embed = createEmbed({
      title: "Recado Secreto ❤️",
      description: frase.replace("@", `<@${targetUser.id}>`),
      timestamp: true,
    });

    await interaction.reply({ embeds: [embed] });
  },
};
