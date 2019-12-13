const semver = require('semver')
const minimist = require('minimist')
const requiredVersion = require('../package.json').engines.node
const Service = require('../lib/index')
const { error } = require('../lib/utils')

validateNodeVersion()
start()

function start() {
  const args = getArgsFromCommondLine()
  const mode = args._[0]
  const service = new Service()
  service.start(mode, args)
}

function validateNodeVersion() {
  if (!semver.satisfies(process.version, requiredVersion)) {
    error(
      `You are using Node ${process.version}, but epay-sparta-service ` +
      `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
    )
    process.exit(1)
  }
}

function getArgsFromCommondLine() {
  const rawArgv = process.argv.slice(2)
  const args = minimist(rawArgv, {
    boolean: [
      'analyze',
      'online',
    ]
  })
  applyProcessEnv(args._.slice(1))
  return args
}

function applyProcessEnv(processEnvSegments) {
  processEnvSegments.forEach(segment => {
    if (validateSegment(segment)) {
      const kv = segment.split('=')
      const key = kv[0]
      const value = kv[1]
      process.env[key] = value
    } else {
      error(`Command-line argument format error - '${segment}' is illegal.`)
      process.exit(1)
    }
  })
}

function validateSegment(segment) {
  return /.+=.+/.test(segment)
}