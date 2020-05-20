'use strict'

let formatError = (message) => `${message} ${new Date()}`

module.exports = {
  fatalBoot: () => formatError('_BOOT_ERROR_ the server is all ready on'),
  fatalShutdown: () => formatError('_SHUTDOWN_ERROR_ the server unable to shutdown'),
}
