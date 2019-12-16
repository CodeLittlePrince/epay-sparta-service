const chalk = require('chalk')

exports.error = (msg) => {
  console.error(_format(chalk.bgRed(' ERROR '), chalk.red(msg)))
  if (msg instanceof Error) {
    console.error(msg.stack)
  }
}

exports.info = (msg) => {
  console.warn(_format(chalk.bgBlue.black(' INFO '), chalk.blue(msg)))
}

exports.warn = (msg) => {
  console.warn(_format(chalk.bgYellow.black(' WARN '), chalk.yellow(msg)))
}

exports.done = (msg) => {
  console.log(_format(chalk.bgGreen.black(' DONE '), chalk.green(msg)))
}

function _format (label, msg) {
  return msg.split('\n').map((line, index) => {
    return index === 0
      ? `${label} ${line}`
      : line
  }).join('\n')
}