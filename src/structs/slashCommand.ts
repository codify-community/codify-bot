import {
    ApplicationCommandOptionChoiceData,
    ApplicationCommandType,
    AutocompleteInteraction,
    CacheType,
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction,
    CommandInteraction,
    MessageFlags,
} from 'discord.js'

import { logger } from '@/utils/logger'

import { storage } from './storage'

type AutocompleteReturn = Promise<
    void | undefined | readonly ApplicationCommandOptionChoiceData[]
>

export type CommandType = ApplicationCommandType.ChatInput
type Cache<D extends boolean> = D extends false ? 'cached' : CacheType

type SlashName<N extends string> = N

type ApplicationCommandData<
    N extends string,
    D extends boolean,
    T extends CommandType,
> = T extends ApplicationCommandType.ChatInput
    ? ChatInputApplicationCommandData & {
          name: SlashName<N>
          execute(
              interaction: ChatInputCommandInteraction<Cache<D>>,
          ): Promise<void>
          autocomplete?(
              interaction: AutocompleteInteraction<Cache<D>>,
          ): AutocompleteReturn
      }
    : never

export type SlashCommandData<
    Name extends string,
    DmPermission extends boolean,
    Type extends CommandType,
> = ApplicationCommandData<Name, DmPermission, Type> & {
    type?: Type
    dmPermission?: DmPermission
}

export type GenericSlashCommandData = SlashCommandData<any, any, any>

/**
 * @description This function registers a slash command.
 * @param {SlashCommandData} data - The slash command data.
 */
export function createSlashCommand<
    Name extends string = string,
    DmPermission extends boolean = false,
    Type extends CommandType = ApplicationCommandType.ChatInput,
>(data: SlashCommandData<Name, DmPermission, Type>) {
    data.type ??= ApplicationCommandType.ChatInput as Type
    data.dmPermission ??= false as DmPermission

    storage.slashCommands.set(data.name, data)
    logger.log(`{/} ${data.name} command registered`)
}

/**
 * @description This function handles slash commands.
 * @param {CommandInteraction} interaction - The interaction object.
 */
export async function handleSlashCommand(interaction: CommandInteraction) {
    const slashCommand = storage.slashCommands.get(interaction.commandName)
    if (!slashCommand)
        return await interaction.reply({
            content: 'Command not found',
            flags: MessageFlags.Ephemeral,
        })

    try {
        await slashCommand.execute(interaction as ChatInputCommandInteraction)
    } catch (error) {
        logger.error(
            `Error executing command: ${interaction.commandName}`,
            error,
        )
        await interaction.reply({
            content: 'An error occurred while executing the command.',
            flags: MessageFlags.Ephemeral,
        })
    }
}
