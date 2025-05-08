const { SlashCommandBuilder, MessageFlags, Colors } = require('discord.js');
const embed = require('../../functions/embed');
const attachs = require("../../attach.json")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const emb = embed.create({ title: "Pong!", description: "Respondido", color: Colors.DarkGold, imageUrl: attachs.gifs.ping })
        await interaction.reply({ embeds: [emb], flags: MessageFlags.Ephemeral })
	}
};
