import { ClientEvents, Collection } from 'discord.js'

import { EventsCollection } from './event'
import { MessageCommandData } from './messageCommand'
import { GenericSlashCommandData } from './slashCommand'

/**
 * @description This object stores collections of commands and events.
 * It contains:
 * - commands: A collection of slash commands.
 * - messageCommands: A collection of message commands.
 * - events: A collection of events.
 */
export const storage = {
    slashCommands: new Collection<string, GenericSlashCommandData>(),
    messageCommands: new Collection<string, MessageCommandData>(),
    events: new Collection<keyof ClientEvents, EventsCollection>(),
    prefix: '!',
}
