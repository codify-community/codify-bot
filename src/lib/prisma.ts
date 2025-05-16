import { logger } from '@/utils/logger'
import { PrismaClient } from '$/generated/prisma'

const db = new PrismaClient({
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
            level: 'info',
        },
        {
            emit: 'stdout',
            level: 'warn',
        },
    ],

    errorFormat: 'pretty',
})

db.$on('query', (e) => {
    logger.log('')
    logger.log('Query: ' + e.query + ' in ' + e.duration + 'ms')
    logger.log('Params: ' + e.params)
    logger.log('')
})

export default db
