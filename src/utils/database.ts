import { execSync } from 'node:child_process'

import { Client } from 'discord.js'

import { env } from '@/env'
import { prisma } from '@/lib/prisma'

import { logger } from './logger'

async function createDatabase(client: Client<true>) {
    const guild = client.guilds.cache.get(env.DISCORD_GUILD_ID)
    if (!guild) {
        logger.error(
            `Guild with ID ${env.DISCORD_GUILD_ID} not found in cache.`,
        )
        return
    }

    logger.log(`⚙️ Creating database for guild ${guild.name}`)
    try {
        await prisma.discordGuild.upsert({
            where: { id: guild.id },
            update: {
                name: guild.name,
                icon: guild.iconURL() ?? undefined,
            },

            create: {
                id: guild.id,
                name: guild.name,
                icon: guild.iconURL() ?? undefined,
                env: {
                    create: {
                        initialMoneyValue: 301.0,
                    },
                },
            },
        })

        logger.success(`Guild successfully synced: ${guild.name}`)
    } catch (err) {
        logger.error(`Failed to sync guild ${guild.name}:`, err)
    }
}

function applyMigrations() {
    try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' })
        logger.success('Migrations applied successfully.')
    } catch (err) {
        logger.error('Error while applying migrations:', err)
    }
}

export async function setupDatabase(client: Client<true>) {
    const guildId = env.DISCORD_GUILD_ID

    const exists = await prisma.discordGuild.findUnique({
        where: { id: guildId },
    })

    if (exists) {
        logger.log('Guild already registered. Applying migrations...')
        applyMigrations()
        return
    }

    logger.log('Guild not found in the database. Creating structure...')
    await createDatabase(client)
}
