const chalk = require('chalk')
const ora = require('ora')
const ansiEscapes = require('ansi-escapes')

let spinner = ora()

const start = (text) => {
  text = chalk.hex('#e5156a')(text)
  spinner = ora(text).start()
  spinner.color = 'red'
}

const succeed = (clear = false) => {
  if (!spinner) return
  if (clear) {
    spinner.stop()
    spinner.clear()
    process.stderr.write(ansiEscapes.eraseLines(1))
  } else {
    spinner.succeed()
  }
  spinner = null
}

const fail = (text) => {
  if (spinner) {
    spinner.fail()
  }
  if (text) {
    console.log(`Error: ${text}`)
    process.exit(1)
  }
}

module.exports = {
  start,
  succeed,
  fail,
}
