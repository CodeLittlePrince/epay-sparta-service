const os = require('os')
const portfinder = require('portfinder')

/**
 * 获取本机IP
 */
function getLocalIP() {
  const interfaces = os.networkInterfaces()
  let addresses = []
  for (let k in interfaces) {
    for (let k2 in interfaces[k]) {
      let address = interfaces[k][k2]
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address)
      }
    }
  }
  return addresses[0]
}

/**
 * 获取可用的本地端口，用于devServer
 */
async function getDevServerPort() {
  // 动态获取端口，默认8080
  portfinder.basePort = 8080
  return await portfinder.getPortPromise()
}

async function getDevConfig() {
  const protocol = 'http'
  const ip = '0.0.0.0' || 'localhost'
  const localIP = getLocalIP(0)
  const devServerPort = await getDevServerPort()
  const devLocalDomain = `${protocol}://localhost`
  const devServerDomain = `${protocol}://${localIP}`
  const proxyServerPort = '7777'
  const proxyServerHost = `${protocol}://${localIP}:${proxyServerPort}`
    
  return {
    ip,
    devServerPort,
    devLocalDomain,
    devServerDomain,
    proxyServerHost
  }
}

module.exports = {
  getDevConfig
}