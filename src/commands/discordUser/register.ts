import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { logCommandUsage } from "@/utils/logCommands";
import { BotColors, createEmbed } from "@/utils/embeds/embedMessages";
import { Log } from "@/utils/log";

import attach from "@/attach.json";
import db from "@/lib/db";

export default {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register in Codify Bot!"),

  async execute(interaction: ChatInputCommandInteraction) {

    logCommandUsage(interaction);

    const { user } = interaction;

    try {
      const guildId = interaction.guild?.id;
      if (!guildId) throw new Error("Seu server não foi não encontrado.");

      const env = await db.discordGuildEnviroment.findUnique({
        where: { guildId }
      });

      if (!env) throw new Error("Configuracoes do seu server não foram encontradas");

      await db.discordUser.create({
        data: {
          id: user.id,
          username: user.username,
          discriminator: user.discriminator,
          avatar: user.avatar,
          wallet: env.initialMoneyValue
        }
      });

      const embed = createEmbed({
        title: "✅ Registrado!",
        description: `Você foi registrado com sucesso!\nUse seu saldo em carteira como quiser!`,
        color: BotColors.success,
        image: user.displayAvatarURL(),
        fields: [
          {
            name: "💰 Saldo Inicial",
            value: `R$ ${env.initialMoneyValue.toFixed(4)}`,
            inline: false
          }
        ]
      });

      await interaction.reply({ embeds: [embed] })
        .then(() => Log.info('Mensagem enviada para o comando /register'))
        .catch(Log.error);
    } catch (err) {

      const embed = createEmbed({
        title: "Deu ruim!",
        description: `você NÃO foi registrado com sucesso!`,
        color: BotColors.danger,
        image: attach.gifs.pc_destroyed
      });

      Log.error(`Erro ao registrar usuário: ${err}`);
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
        .then(() => Log.info('Mensagem de erro enviada para o comando /register'))
        .catch(Log.error);
    } finally {
      await db.$disconnect();
    }
  }
};
