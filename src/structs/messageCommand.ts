import { Message, OmitPartialGroupDMChannel } from 'discord.js'

import { getMessageCommandName } from '@/utils/getMessageCommandName'
import { logger } from '@/utils/logger'

import { storage } from './storage'

type CommandName<N extends string> = N

export type MessageCommandData = {
    name: CommandName<string>
    execute(message: OmitPartialGroupDMChannel<Message>): Promise<void>
}

/**
 * @description This function registers a message command.
 * @param {MessageCommandData} data - The message command data.
 */
export function createMessageCommand(data: MessageCommandData) {
    storage.messageCommands.set(data.name, data)
    logger.log(`{#} ${data.name} command registered`)
}

/**
 * @description This function handles message commands.
 * @param {OmitPartialGroupDMChannel<Message<boolean>>} message - The message object.
 */
export async function handleMessageCommand(
    message: OmitPartialGroupDMChannel<Message<boolean>>,
) {
    const messageCommandName = getMessageCommandName(message)
    const messageCommand = storage.messageCommands.get(messageCommandName)
    if (!messageCommand) return await message.reply('Command not found')

    try {
        await messageCommand.execute(message)
    } catch (error) {
        logger.error(
            `Error executing message command: ${message.content}`,
            error,
        )
        await message.reply('An error occurred while executing the command.')
    }
}
