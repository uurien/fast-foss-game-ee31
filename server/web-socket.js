'use strict'

const { WebSocketServer  } = require('ws')
const crypto = require('crypto')
const NEW_GAME = 'NEW_GAME'
const ADD_TO_GAME = 'ADD_TO_GAME'
const UPDATE = 'UPDATE'
const games = new Map()
const wsCode = new WeakMap()



module.exports = {
    start () {
        console.log('start web socket')
        const wss = new WebSocketServer({ port: 1111 })
        wss.on('connection', function (ws) {
            let game, code, player, gameData
            console.log('connected')
            ws.on('error', console.error);
            ws.on('message', function message(dataString) {
                const data = JSON.parse(dataString.toString())
                const { message } = data
                switch (message) {
                    case NEW_GAME: {
                        player = 0
                        code = ('' + crypto.randomInt(0, 999999)).padStart(6, '0')
                        gameData = {
                            ws,
                            code,
                            player
                        }
                        game = [gameData]
                        games.set(code, game)

                        ws.send(JSON.stringify({message: 'CREATED', code}));
                        wsCode.set(ws, code)
                    }
                        break;
                    case ADD_TO_GAME: {
                        try {
                            code = data.code
                            game = games.get(code)
                            if (!game) {
                                throw new Error('Invalid code')
                            }
                            if (game.length >= 2) {
                                throw new Error('Game already started')
                            }
                            player = game.length
                            gameData = {
                                ws,
                                code,
                                player
                            }
                            game.push(gameData)

                            game.forEach(gameObj => {
                                gameObj.ws.send(
                                    JSON.stringify({
                                        message: 'START',
                                        player: gameObj.player
                                    })
                                )
                            })

                            ws.send(JSON.stringify({message: 'ADDED', player: gameData.player}));
                            wsCode.set(ws, code)
                        } catch (e) {
                            ws.send(JSON.stringify({ message: 'ERROR', stack: e.stack, details: e.message }))
                        }
                    }
                        break;
                    case UPDATE: {
                        game.forEach(gameData => {
                            gameData.ws.send(JSON.stringify({ message: 'UPDATE', keys: data.keys, player }))
                        })
                        // TODO share received updated
                    }
                        break;
                }
            });

            ws.on('close', function () {
                try {
                    const code = wsCode.get(ws)
                    const game = games.get(code)
                    let currentWs = ws
                    const index = game.findIndex(({ws}) => {
                        if (ws === currentWs) return true
                        return false
                    })
                    game.splice(index, 1)
                    if (game.length === 0) {
                        games.delete(code)
                    }
                } catch (e) {
                    // just survive
                }
            })
        })
    }
}
