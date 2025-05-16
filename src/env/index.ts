import 'dotenv/config'

import z from 'zod'

import { logger } from '@/utils/logger'

const envSchema = z.object({
    DISCORD_TOKEN: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_GUILD_ID: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
    logger.error('Invalid environment variables', _env.error.format())
    throw new Error('Invalid environment variables.')
}

export const env = _env.data
