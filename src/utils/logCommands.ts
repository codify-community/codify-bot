import chalk from 'chalk'
import { ChatInputCommandInteraction, TextChannel } from 'discord.js'

import { Log } from './log'

export function logCommandUsage(interaction: ChatInputCommandInteraction) {
    const user = interaction.user.tag
    const server = interaction.guild?.name || 'DM'
    const channel =
        interaction.channel?.type === 0 ||
        interaction.channel?.type === 5 ||
        interaction.channel?.type === 11
            ? (interaction.channel as TextChannel).name
            : 'Canal privado ou sem nome'
    const command = interaction.commandName

    const logMessage = `${chalk.hex('#ff69b4')(`[${server}]`)} ${chalk.green(`#${channel}`)} - ${chalk.yellow(`@${user}`)} executou ${chalk.blue(`/${command}`)}`
    Log.info(logMessage, false)
}
