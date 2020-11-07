'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CDN_PATH: '"https://unpkg.com/cloud-computer-custom@0/dist/cloud-computer-custom.umd.min.js"'
})
