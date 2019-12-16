// https://github.com/eslint/eslint/blob/master/docs/developer-guide/nodejs-api.md#cliengine
const CLIEngine = require('eslint').CLIEngine
const stylelint = require('stylelint')
const { done, info } = require('../../utils')

class LintService {
  constructor(context) {
    this.context = context
  }

  async run() {
    this._lintJs()
    this._lintStyle()
    this._doneTip()
  }

  _lintJs() {
    info('Linting js and vue ...')
    const cli = new CLIEngine({
      extensions: ['.vue', '.js']
    })
    const report = cli.executeOnFiles([this.context.resolve('src')])
    const formatter = cli.getFormatter()
    const results = formatter(report.results)
    if (results) {
      console.log(results)
    }
    // Fail once there is a warning or error
    if (report.errorCount || report.warningCount) {
      process.exit(1)
    }
  }

  _lintStyle() {
    info('Linting scss ...')
    stylelint.lint({
      files: this.context.resolve('src/**/*.(vue|scss)'),
      syntax: 'scss',
    }).then(function(res) {
      if (res.errored) {
        const stylelintOutput = require('stylelint/lib/formatters/stringFormatter')(res.results)
        console.log(stylelintOutput.substr(0, stylelintOutput.length - 1))
        process.exit(1)
      }
    })
  }

  _doneTip() {
    done('Linting success!')
  }
}

module.exports = LintService