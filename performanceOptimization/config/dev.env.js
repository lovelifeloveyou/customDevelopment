'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CDN_PATH: '" https://vcsstore.oss-cn-hangzhou.aliyuncs.com/cloudComputerComponent/production/cloud-computer-custom.umd.min.js"'
})
