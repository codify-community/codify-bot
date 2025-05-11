import { Colors, EmbedBuilder } from 'discord.js'

import { EmbedOptions } from './embed.types'

export const BotColors = {
    primary: Colors.Blurple,
    success: Colors.Green,
    warning: Colors.Yellow,
    danger: Colors.Red,
    info: Colors.Blue,
    codify: '#9146FF' as const,
}

export function createEmbed(options: EmbedOptions): EmbedBuilder {
    const embed = new EmbedBuilder()

    if (options.author) {
        embed.setAuthor(options.author)
    }

    if (options.title) {
        embed.setTitle(options.title)
    }

    if (options.url) {
        embed.setURL(options.url)
    }

    if (options.description) {
        embed.setDescription(options.description)
    }

    if (options.fields) {
        embed.addFields(options.fields)
    }

    if (options.image) {
        embed.setImage(options.image)
    }

    if (options.thumbnail) {
        embed.setThumbnail(options.thumbnail)
    }

    embed.setColor(options.color || BotColors.codify)

    embed.setFooter({
        text: options.footer?.text || 'by Codify',
        iconURL: options.footer?.iconURL,
    })

    if (options.timestamp) {
        embed.setTimestamp()
    }

    return embed
}
