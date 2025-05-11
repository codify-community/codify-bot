import { Log } from '@/utils/log'
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
    console.log('')
    Log.database('Query: ' + e.query + ' in ' + e.duration + 'ms')
    Log.database('Params: ' + e.params)
    console.log('')
})

export default db
