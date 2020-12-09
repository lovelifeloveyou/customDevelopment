let config
if (process.env.NODE_ENV == 'development') {  // dev环境
  config = require('./config/config.dev')
} else if (process.env.NODE_ENV == 'test') { // 测试环境
  config = require('./config/config.test')
} else if (process.env.NODE_ENV == 'pre') { // 预发布环境
  config = require('./config/config.pre')
} else {
  config = require('./config/config.build')
}
export default config.default
