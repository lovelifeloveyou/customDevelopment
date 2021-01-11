'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CDN_PATH: '"https://reso.dalongyun.com/yun/dalongyun_page/webRtc/cloudComputerComponent/pre/cloud-computer-custom.umd.min.js"'
})
