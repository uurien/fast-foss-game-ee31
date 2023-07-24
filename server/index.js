'use strict'

const webServer = require('./web-server')
const webSocket = require('./web-socket')

webServer.start()
webSocket.start()