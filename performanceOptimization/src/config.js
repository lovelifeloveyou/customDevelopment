let config
if (process.env.NODE_ENV == 'development') {  // dev环境
  config = require('./config/config.dev')
} else if(process.env.NODE_ENV == 'test'){
  config = require('./config/config.uat')
}
else{
  config = require('./config/config.build')
}
export default config.default
