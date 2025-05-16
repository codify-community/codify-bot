import { Message, OmitPartialGroupDMChannel } from 'discord.js'

import { storage } from '@/structs/storage'

/**
 * @description This function checks if a message is a command.
 * @param {OmitPartialGroupDMChannel<Message<boolean>>} message - The message object.
 * @returns {boolean} - Returns true if the message is a command, false otherwise.
 */
export function getMessageCommandName(
    message: OmitPartialGroupDMChannel<Message<boolean>>,
): string {
    const commandNameWithPrefix = message.content.split(' ')[0]
    return commandNameWithPrefix.replace(storage.prefix, '')
}
