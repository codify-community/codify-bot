import { bootstrap } from './structs/client'

bootstrap({
    workdir: '../modules',
    intents: ['Guilds', 'GuildMessages', 'MessageContent'],
})
