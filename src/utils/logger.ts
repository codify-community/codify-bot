import chalk from 'chalk'

type LogArgs = [message: string, ...params: any[]]

function log(...args: LogArgs) {
    return console.log(chalk.gray(`• [LOG]:`), ...args)
}

function success(...args: LogArgs) {
    return console.log(chalk.green(`✓ [SUCCESS]:`), ...args)
}

function warn(...args: LogArgs) {
    return console.warn(chalk.yellow(`▲ [WARN]:`), ...args)
}

function error(...args: LogArgs) {
    return console.error(chalk.red(`✖︎ [ERROR]:`), ...args)
}

function debug(...args: LogArgs) {
    return console.debug(chalk.blue(`➤ [DEBUG]:`), ...args)
}

export const logger = {
    log,
    success,
    warn,
    error,
    debug,
}
