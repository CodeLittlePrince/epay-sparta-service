const proxyServerConfig = require('../config/proxyServer')
const path = require('path')
const mockRoot = path.join(__dirname, './mockData')
const KoaMockSwitch = require('koa-mock-switch')
const mockSwitchMap = require('./mockSwitchMap')
const mock = new KoaMockSwitch({
  root: mockRoot,
  port: proxyServerConfig.port,
  switchMap: mockSwitchMap,
  apiPrefix: '/api',
  apiSuffix: '.json'
})
mock.start()

// nodemon会command+c终止终端都无法关闭mock进程
// 所以需要进程接受信号来调用koa-mock-switch接口来关闭
;['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    mock.stop()
  })
})