const { EmbedBuilder } = require('discord.js');

module.exports = {
    create(obj) {
        let { title, description, color, imageUrl, fields } = obj;

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setFooter({
                text: "by BotCurumin",
            })
            .setTimestamp();

        if (fields) {
            embed.addFields(fields)
        }

        if (imageUrl) {
            embed.setImage(imageUrl)
        }

        return embed;
    }
}