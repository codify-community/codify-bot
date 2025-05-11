import chalk from 'chalk'

export const Log = {
    info(message: string, useColor: boolean = true) {
        if (useColor) {
            console.log(`${chalk.cyanBright('[INFO]')} ${chalk.cyan(message)}`)
        } else {
            console.log(`[INFO] ${message}`)
        }
    },

    warn(message: string, useColor: boolean = true) {
        if (useColor) {
            console.warn(
                `${chalk.yellowBright('[WARN]')} ${chalk.yellow(message)}`,
            )
        } else {
            console.warn(`[WARN] ${message}`)
        }
    },

    error(message: string, useColor: boolean = true) {
        if (useColor) {
            console.error(`${chalk.redBright('[ERROR]')} ${chalk.red(message)}`)
        } else {
            console.error(`[ERROR] ${message}`)
        }
    },

    success(message: string, useColor: boolean = true) {
        if (useColor) {
            console.log(
                `${chalk.greenBright('[SUCCESS]')} ${chalk.green(message)}`,
            )
        } else {
            console.log(`[SUCCESS] ${message}`)
        }
    },

    database(message: string) {
        console.log(`${chalk.magentaBright('[DATABASE]')} ${message}`)
    },
}
