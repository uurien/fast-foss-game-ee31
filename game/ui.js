GAME = typeof GAME === 'undefined' ? {} : GAME;
const host  = window.location.hostname;
const wsUrl = `ws://${host}:1111`;
(function () {
    let waiting = true;
    function hide (element) {
        element.classList.add('hidden')
    }

    function show (element) {
        element.classList.remove('hidden')
    }

    const homeElement = document.getElementById('home')
    const waitRoom = document.getElementById('wait-room')
    const finishElement = document.getElementById('finish')
    const startButton = document.getElementById('start')
    const startOnlineButton = document.getElementById('start-online')
    const restartButton = document.getElementById('restart')
    const addToExistingForm = document.getElementById('add-to-existing-form')
    startButton.addEventListener('click', () => {
        hide(homeElement)
        GAME.methods.configureKeys()
        GAME.running = true
    })

    restartButton.addEventListener('click', () => {
        GAME.methods.restart()
        hide(finishElement)
    })

    addToExistingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const ws = new WebSocket(wsUrl)
        const code = document.getElementById('add-to-existing-field').value.trim()
        ws.onopen = function () {
            ws.send(JSON.stringify({ message: 'ADD_TO_GAME', code }))
        }
        ws.onmessage = function (...args) {
            if (waiting) {
                data = JSON.parse(args[0].data)
                const { message } = data
                if (message === 'START') {
                    GAME.player = data.player
                    GAME.ws = ws
                    GAME.methods.configureKeys()
                    hide(homeElement)
                    GAME.running = true
                    waiting = false;
                }
            } else {
                GAME.methods.onWsMessage && GAME.methods.onWsMessage(...args)
            }
        }
    })

    startOnlineButton.addEventListener('click', () => {
        const ws = new WebSocket(wsUrl)
        ws.onopen = function () {
            ws.send(JSON.stringify({ message: 'NEW_GAME' }))
        }
        ws.onmessage = function (...args) {
            if (waiting) {
                data = JSON.parse(args[0].data)
                const { message, code } = data
                if (message === 'CREATED') {
                    document.getElementById('code').innerText = code
                } else if (message === 'START') {
                    GAME.player = data.player
                    GAME.methods.configureKeys()
                    hide(waitRoom)
                    GAME.running = true
                    waiting = false;
                }
            } else {
                GAME.methods.onWsMessage && GAME.methods.onWsMessage(...args)
            }
        }
        GAME.ws = ws
        hide(homeElement)
        show(waitRoom)
    })

    const winnerPlaceholder = document.getElementById('winner-name')
    GAME.uiMethods = {
        showFinish (winnerName) {
            winnerPlaceholder.innerText = winnerName;
            finishElement.classList.remove('hidden')
        }
    }
})()
