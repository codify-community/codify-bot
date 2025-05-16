import chalk from 'chalk'
import { Client, ClientEvents, Collection } from 'discord.js'

import { logger } from '@/utils/logger'

import { storage } from './storage'

export interface EventData<EventName extends keyof ClientEvents> {
    name: string
    event: EventName
    once?: boolean
    execute(...args: ClientEvents[EventName]): Promise<void>
}

type GenericEventData = EventData<keyof ClientEvents>
export type EventsCollection = Collection<string, GenericEventData>

type GenericEventHandler = {
    execute: (...args: any[]) => Promise<void>
}

/**
 * @description This function registers event handlers for the client.
 * @param {Client} client - The Discord client.
 */
export function registerEventHandlers(client: Client) {
    const eventHandlers = storage.events.map((collection, event) => ({
        event,
        handlers: collection.map((e) => ({ execute: e.execute, once: e.once })),
    }))

    for (const { event, handlers } of eventHandlers) {
        const onEventHandlers = handlers.filter((e) => !e.once)
        const onceEventHandlers = handlers.filter((e) => e.once)

        const registerHandlers = (handlers: GenericEventHandler[]) => {
            return async (...args: ClientEvents[typeof event]) => {
                for (const handler of handlers) {
                    await handler.execute(...args)
                }
            }
        }

        client.on(event, registerHandlers(onEventHandlers))
        client.once(event, registerHandlers(onceEventHandlers))
    }
}

/**
 * @description This function creates an event.
 * @param {EventData} data - The event data.
 */
export function createEvent<EventName extends keyof ClientEvents>(
    data: EventData<EventName>,
) {
    const eventCollection = storage.events.get(data.event) ?? new Collection()

    eventCollection.set(data.name, data)
    storage.events.set(data.event, eventCollection)

    logger.log(
        `{⋆} ${data.name} event registered ${chalk.blue(`(${data.event})`)}`,
    )
}
