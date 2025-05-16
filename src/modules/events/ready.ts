import { createEvent } from '@/structs/event'
import { setupDatabase } from '@/utils/database'

createEvent({
    event: 'ready',
    name: 'startupDatabase',
    once: true,
    async execute(client) {
        await setupDatabase(client)
    },
})
