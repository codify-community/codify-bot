import chalk from 'chalk'
import {
    AutocompleteInteraction,
    Client,
    ClientOptions,
    GatewayIntentBits,
} from 'discord.js'
import fs, { PathLike } from 'fs'
import path from 'path'

import { env } from '@/env'
import { isMessageCommand } from '@/utils/isMessageCommand'
import { logger } from '@/utils/logger'

import { registerEventHandlers } from './event'
import { handleMessageCommand } from './messageCommand'
import { handleSlashCommand } from './slashCommand'
import { storage } from './storage'

interface BootstrapOptions extends Partial<ClientOptions> {
    workdir: PathLike
}

/**
 * @description This function bootstraps a Discord client with the specified options.
 * @param {BootstrapOptions} options - The options for bootstrapping the client.
 * @returns {{ client: Client }} - The created Discord client.
 */
export function bootstrap(options: BootstrapOptions): { client: Client } {
    const client = createClient(env.DISCORD_TOKEN, options)

    loadModules(options.workdir)
    registerEventHandlers(client)

    client.login()

    return { client }
}

/**
 * @description This function creates a Discord client with the specified token and options.
 * @param {string} token - The Discord bot token.
 * @param {BootstrapOptions} options - The options for creating the client.
 * @returns {Client} - The created Discord client.
 */
function createClient(token: string, options: BootstrapOptions): Client {
    const client = new Client({
        intents: options.intents ?? [GatewayIntentBits.Guilds],
        partials: options.partials ?? [],
    })
    client.token = token

    client.once('ready', async (client) => {
        logger.success(`Logged in as ${client.user?.tag}`)
        await registerSlashCommands(client)
    })

    client.on('interactionCreate', async (interaction) => {
        switch (true) {
            case interaction.isCommand():
                await handleSlashCommand(interaction)
                return
            case interaction.isAutocomplete():
                await handleAutocomplete(interaction)
                return
        }
    })

    client.on('messageCreate', async (message) => {
        if (!isMessageCommand(message)) return
        await handleMessageCommand(message)
    })

    return client
}

/**
 * @description This function handles autocomplete interactions.
 * @param {AutocompleteInteraction} interaction - The interaction object.
 */
async function handleAutocomplete(interaction: AutocompleteInteraction) {
    const autocompleteCommand = storage.slashCommands.get(
        interaction.commandName,
    )
    if (autocompleteCommand && autocompleteCommand.autocomplete) {
        const choices = await autocompleteCommand.autocomplete(interaction)
        if (choices && Array.isArray(choices)) {
            interaction.respond(choices.slice(0, 25))
        }
    }
}

/**
 * @description This function loads modules from the specified directory.
 * @param {PathLike} workdir - The directory to load modules from.
 */
function loadModules(workdir: PathLike) {
    const modulesPath = path.resolve(__dirname, workdir.toString())

    function readAllFilesRecursively(dir: string): string[] {
        const entries = fs.readdirSync(dir, { withFileTypes: true })

        return entries.flatMap((entry) => {
            const fullPath = path.join(dir, entry.name)
            if (entry.isDirectory()) {
                return readAllFilesRecursively(fullPath)
            } else if (entry.isFile() && /\.(t|j)s$/.test(entry.name)) {
                return [fullPath]
            } else {
                return []
            }
        })
    }

    const files = readAllFilesRecursively(modulesPath)
    logger.log(`Loading ${files.length} modules...`)

    files.forEach((file, index) => {
        const shortPath = file.replace(modulesPath, '').replace(/^[\\/]/, '')
        try {
            require(file)
            logger.success(
                `[${index + 1}/${files.length}] Module loaded: ${chalk.blue(shortPath)}`,
            )
        } catch (error) {
            logger.error(
                `[${index + 1}/${files.length}] Failed to load module: ${chalk.red(shortPath)}`,
                error,
            )
        }
    })
}

/**
 * @description This function registers slash commands in the specified guild.
 * @param {Client} client - The Discord client.
 */
async function registerSlashCommands(client: Client<true>) {
    function plural(size: number) {
        return size === 1 ? '' : 's'
    }

    const guild = client.guilds.cache.get(env.DISCORD_GUILD_ID)
    if (!guild) return logger.error('Guild not found')

    logger.log(`Registering slash commands in ${guild.name} guild:`)
    const guildCommands = storage.slashCommands.map(
        (slashCommand) => slashCommand,
    )

    if (guildCommands.length === 0) {
        logger.warn('No slash commands to register')
        return
    }

    await guild.commands
        .set(guildCommands)
        .then((commands) => {
            logger.success(
                `└ {/} [${commands.size}] command${plural(commands.size)} registered in ${guild.name} guild successfully!`,
            )
        })
        .catch((error) => {
            logger.error(
                `Failed to register {/} commands in ${guild.name} guild`,
                error,
            )
        })
}
