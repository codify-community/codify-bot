
// src/commands/server.ts
import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, MessageFlags } from "discord.js";
import db from "@/lib/db";
import { createEmbed, BotColors } from "@/utils/embeds/embedMessages";

export default {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Comandos para administrar o servidor.")
    .addSubcommand(subcommand =>
      subcommand
        .setName("register")
        .setDescription("Registra o servidor atual no sistema."))
    .addSubcommand(subcommand =>
      subcommand
        .setName("env")
        .setDescription("Configura variáveis de ambiente do servidor.")
        .addStringOption(option =>
          option.setName("key").setDescription("Nome da variável").setRequired(true))
        .addStringOption(option =>
          option.setName("value").setDescription("Valor a ser definido").setRequired(true))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand();
    const guild = interaction.guild;

    if (!guild) {
      return interaction.reply({ content: "Este comando só pode ser usado dentro de um servidor.", flags: MessageFlags.Ephemeral });
    }

    // /server register
    if (sub === "register") {
      if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
        return interaction.reply({ content: "Você precisa ter permissão de gerenciar servidor para registrar.", flags: MessageFlags.Ephemeral });
      }

      try {
        await db.discordGuild.create({
          data: {
            id: guild.id,
            name: guild.name,
            icon: guild.iconURL() ?? undefined
          }
        });

        const embed = createEmbed({
          title: "Servidor Registrado!",
          description: `${guild.name} foi registrado com sucesso!`,
          color: BotColors.success
        });

        await interaction.reply({ embeds: [embed] });
      } catch {
        return interaction.reply({ content: "Erro ao registrar o servidor ou ele já está registrado.", flags: MessageFlags.Ephemeral });
      }
    }

    // /server env key value
    if (sub === "env") {
      if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) {
        return interaction.reply({ content: "Você precisa ser moderador para usar esse comando.", flags: MessageFlags.Ephemeral });
      }

      const key = interaction.options.getString("key", true);
      const value = interaction.options.getString("value", true);

      if (key !== "initialMoneyValue") {
        return interaction.reply({ content: "Chave de ambiente inválida.", flags: MessageFlags.Ephemeral });
      } else {
        try {
          const decimal = parseFloat(value);

          await db.discordGuildEnviroment.upsert({
            where: { guildId: guild.id },
            update: { initialMoneyValue: decimal },
            create: {
              guildId: guild.id,
              initialMoneyValue: decimal
            }
          });

          const embed = createEmbed({
            title: "Ambiente Atualizado",
            description: `A variável **${key}** foi definida como **${value}** com sucesso!`,
            color: BotColors.success
          });

          await interaction.reply({ embeds: [embed] });
        } catch {
          return interaction.reply({ content: "Erro ao atualizar variável de ambiente.", flags: MessageFlags.Ephemeral });
        }
      }
    }
  }
};
