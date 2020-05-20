'use strict'

let formatError = (message) => `${message} ${new Date()}`

module.exports = {
  fatalBoot: () => formatError('_BOOT_ERROR_ the server is all ready on'),
  fatalShutdown: () => formatError('_SHUTDOWN_ERROR_ the server unable to shutdown'),
  fatalRedisInit: () => formatError('_REDIS_INIT_ERROR_ there is allready a connected client'),
  fatalRedisQuit: () => formatError('_REDIS_QUIT_ERROR_ there is no redis client to quit'),
  redisMethodCallFail: (method) => formatError(`_REDIS_METHOD_CALL_ERROR_ there is no method with the name [${method}]`),
  
}
