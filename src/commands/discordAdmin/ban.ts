import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, MessageFlags, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
              .setName("ban")
              .setDescription("Comando para banir alguém")
              .addUserOption(option =>
                option.setName("usuario")
                  .setDescription("Informe o usuário a ser banido")
                  .setRequired(true)
              )
              .addStringOption(option =>
                option.setName("motivo")
                  .setDescription("Razão pelo qual o usuário foi banido (opcional)")
                  .setRequired(false)
              ),

  async execute(interaction: ChatInputCommandInteraction) {
    if(!interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: 'Você não tem permissão para usar esse comando',
        flags: MessageFlags.Ephemeral
      });
    }

    const user = interaction.options.getUser("usuario")!;
    const reason = interaction.options.getString("motivo") || "Motivo não especificado";

    try {
      await interaction.guild?.members.ban(user, { reason });

      await interaction.reply({embeds: [
        new EmbedBuilder()
              .setTitle("Usuário banido")
              .setFields([
                {
                  name: `👤 Usuário`,
                  value: `${user.tag}`,
                  inline: true
                },
                {
                  name: `🛡️ Moderador`,
                  value: `${interaction.member?.user.id}`,
                  inline: true
                },
                {
                  name: `📜 Motivo`,
                  value: reason,
                  inline: false
                }
              ])
              .setDescription(`O usuário ${user.tag} foi banido!`)
      ]});
    } catch (err) {
      console.log(`Náo foi possível banir o usuario ${user}\n Motivo: ${err}`);
      await interaction.reply({
        content: 'Erro interno ocorreu, contate o suporte da Codify',
        flags: MessageFlags.Ephemeral
      });
    }
  }
}