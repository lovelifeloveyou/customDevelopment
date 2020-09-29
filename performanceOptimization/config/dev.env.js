'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const uat =require('./uat.env')

module.exports = merge(prodEnv,uat, {
  NODE_ENV: '"development"'
})
