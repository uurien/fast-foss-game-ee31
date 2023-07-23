GAME = typeof GAME === 'undefined' ? {} : GAME;
(function () {
    function hide (element) {
        element.classList.add('hidden')
    }

    function show (element) {
        element.classList.add('hidden')
    }

    function showFinished () {

    }

    const homeElement = document.getElementById('home')
    const finishElement = document.getElementById('finish')
    const startButton = document.getElementById('start')
    const restartButton = document.getElementById('restart')

    startButton.addEventListener('click', () => {
        hide(homeElement)
    })

    restartButton.addEventListener('click', () => {
        GAME.methods.restart()
        hide(finishElement)
    })

    const winnerPlaceholder = document.getElementById('winner-name')
    GAME.uiMethods = {
        showFinish (winnerName) {
            winnerPlaceholder.innerText = winnerName;
            finishElement.classList.remove('hidden')
        }
    }
})()
