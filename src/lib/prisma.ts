import { logger } from '@/utils/logger'
import { PrismaClient } from '$/generated/prisma'

export const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'stdout',
            level: 'error',
        },
        {
            emit: 'stdout',
            level: 'warn',
        },
    ],
    errorFormat: 'pretty',
})

prisma.$on('query', (event) => {
    logger.log(`'Query: ${event.query} in ${event.duration}ms'`)
    logger.log(`Params: ${event.params}`)
})
