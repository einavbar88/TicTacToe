const board = document.getElementById('board')
let logicBoardArray
let boardHtmlReferences
let isXTurn = true
let isSinglePlayer = true
let turnNumber = 0

////////////////////////buttons/////////////////////////////
////new game
const newGameBtn = document.getElementById('new-game-btn')
newGameBtn.addEventListener('click', () => { gamePlay() })
newGameBtn.addEventListener('mouseenter', () => { newGameBtn.classList.add('hover') })
newGameBtn.addEventListener('mouseleave', () => { newGameBtn.classList.remove('hover') })
////amount of players
const playersBtn = document.getElementById('players-btn')
playersBtn.addEventListener('click', () => { changeSingleMultiPlayer() })
playersBtn.addEventListener('mouseenter', () => { playersBtn.classList.add('hover') })
playersBtn.addEventListener('mouseleave', () => { playersBtn.classList.remove('hover'); })
////change single/multiplayer
function changeSingleMultiPlayer() {
    isSinglePlayer = !isSinglePlayer
    playersBtn.innerText = isSinglePlayer ? '1 Player' : '2 Players'
    gamePlay()
}
/////////////////////////////////////////////
class Cell {
    constructor() {
        this.isEmpty = true
    }
    toString = () => {
        return 'E'
    }
}

class X extends Cell {
    constructor() {
        super()
        this.isEmpty = false
        this.piece = 'X'
    }
    toString = () => {
        return this.piece
    }
}

class O extends Cell {
    constructor() {
        super()
        this.isEmpty = false
        this.piece = 'O'
    }
    toString = () => {
        return this.piece
    }
}

//board-initialization
function initializeBoard() {
    for (let i = 0; i < 3; i++) {
        let columnHtmlRef = []
        let columnLogic = []
        for (let j = 0; j < 3; j++) {
            if (j === 0) {
                let col = document.createElement('div')
                col.className = 'flex-container-column'
                board.appendChild(col)
            }
            let cell = document.createElement('div')
            cell.className = 'flex-squares'
            cell.id = j + '' + i
            columnLogic.push(new Cell(cell.id))
            columnHtmlRef.push(cell)
            board.childNodes[i + 1].appendChild(cell)
        }
        logicBoardArray.push(columnLogic)
        boardHtmlReferences.push(columnHtmlRef)
        console.log()
    }
}

//event listeners for cells
function addEventListenerForCells() {
    for (let j = 0; j < 3; j++)
        for (let i = 0; i < 3; i++)
            boardHtmlReferences[i][j].addEventListener('click', () => {
                if (isLegalMove(logicBoardArray, i, j)) {
                    playerTurn(logicBoardArray, i, j)
                    turnApplyUI(i, j)
                    checkIfGameHasEnded(logicBoardArray)
                    isXTurn = !isXTurn
                    if (isSinglePlayer) 
                       setTimeout(function(){AITurn(logicBoardArray)},150)
                }
            })
}
function AITurn(logicBoardArray) {
    let turn = OAITurn(logicBoardArray)
    playerTurn(logicBoardArray, turn[0], turn[1])
    turnApplyUI(turn[0], turn[1])
    checkIfGameHasEnded(logicBoardArray)
    isXTurn = !isXTurn
}
function turnApplyUI(x, y) {
    let piece = createVisualPiece()
    boardHtmlReferences[x][y].appendChild(piece)
}
function createVisualPiece() {
    let ret = document.createElement('div')
    ret.classList.add('piece')
    if (isXTurn)
        ret.innerText = 'X'
    else
        ret.innerText = 'O'
    return ret
}
function gamePlay() {
    newGame()
    while (board.childNodes[1] != undefined)
        board.removeChild(board.childNodes[1])
    initializeBoard()
    addEventListenerForCells()
}


//////////////////////////////////TicTacToeLogic.js////////////////////////////////////////////
function isLegalMove(logicBoardArray, x, y) {
    return logicBoardArray[x][y].isEmpty
}
function hasGameEnded(logicBoardArray) {
    if (hasGameWon(logicBoardArray)) {
        alert(isXTurn ? 'Player 1 has Won!' : 'Player 2 has Won!')
        return true
    }
    else if (hasGameEndedInTie(logicBoardArray)) {
        alert('Tie!')
        return true
    }
    return false
}
function hasGameEndedInTie(logicBoardArray) {
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (logicBoardArray[i][j].isEmpty)
                return false
    return true
}
function hasGameWon(logicBoardArray) {
    let isHorizontalOrPortrait = false
    let isDiagonal = isDiagonalStreak(logicBoardArray)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (i > 0 && j > 0)
                continue
            if (isHorizontalOrPortraitStreak(logicBoardArray, i, j))
                isHorizontalOrPortrait = true
        }
    }
    return isDiagonal || isHorizontalOrPortrait
}
function isHorizontalOrPortraitStreak(logicBoardArray, x, y) {
    //portrait
    let isPortraitStreak = true
    for (let i = 0; i < 3; i++)
        if (logicBoardArray[i][y].toString() !== logicBoardArray[x][y].toString() || logicBoardArray[x][y].toString() === 'E')
            isPortraitStreak = false
    //horizontal
    let isHorizontalStreak = true
    for (let i = 0; i < 3; i++)
        if (logicBoardArray[x][i].toString() !== logicBoardArray[x][y].toString() || logicBoardArray[x][y].toString() === 'E')
            isHorizontalStreak = false

    return isPortraitStreak || isHorizontalStreak
}
function isDiagonalStreak(logicBoardArray) {
    if (logicBoardArray[1][1].toString() === 'E')
        return false
    if (logicBoardArray[0][0].toString() === logicBoardArray[1][1].toString() && logicBoardArray[0][0].toString() === logicBoardArray[2][2].toString())
        return true
    if (logicBoardArray[0][2].toString() === logicBoardArray[1][1].toString() && logicBoardArray[0][2].toString() === logicBoardArray[2][0].toString())
        return true
}
function insertToBoard(logicBoardArray, isXTurn, x, y) {
    if (isXTurn)
        logicBoardArray[x][y] = new X()
    else
        logicBoardArray[x][y] = new O()
}
function playerTurn(logicBoardArray, x, y) {
    insertToBoard(logicBoardArray, isXTurn, x, y)
    turnNumber++
}
function checkIfGameHasEnded(logicBoardArray) {
    if (hasGameEnded(logicBoardArray)) {
        gameStop()
    }
}
function newGame() {
    turnNumber = 0
    logicBoardArray = []
    boardHtmlReferences = []
    isXTurn = true
}
function gameStop() {
    boardHtmlReferences = []
}
function OAITurn(logicBoardArray) {
    if (turnNumber === 1) {
        if (logicBoardArray[1][1].isEmpty)
            return [1, 1]
        return [0, 0]
    }
    //winning-chance
    let win = streak(logicBoardArray, true)
    if (win !== null)
        return win
    //threat
    let block = streak(logicBoardArray, false)
    if (block !== null)
        return block
    //no-threat-turn
    let noThreatTurn = regularTurn(logicBoardArray)
    return noThreatTurn
}
function streak(logicBoardArray, isToWin) {
    if (isDiagonalStreakPossible(logicBoardArray) || isToWin) {
        let streak = diagonalStreak(logicBoardArray)
        if (streak !== null)
            return streak
    }
    let horizontalStreak = horizontalOrPortraitStreak(logicBoardArray, false, isToWin)
    if (horizontalStreak !== null)
        return horizontalStreak

    let portraitStreak = horizontalOrPortraitStreak(logicBoardArray, true, isToWin)
    if (portraitStreak !== null)
        return portraitStreak

    return null
}
function isDiagonalStreakPossible(logicBoardArray) {
    if (logicBoardArray[1][1].toString() === 'O')
        return false
    return true
}
function diagonalStreak(logicBoardArray) {
    let board = logicBoardArray
    if (board[0][0].toString() === board[1][1].toString() && board[2][2].isEmpty)
        return [2, 2]
    if (board[2][2].toString() === board[1][1].toString() && board[0][0].isEmpty)
        return [0, 0]
    if (board[2][0].toString() === board[1][1].toString() && board[0][2].isEmpty)
        return [0, 2]
    if (board[0][2].toString() === board[1][1].toString() && board[2][0].isEmpty)
        return [2, 0]
    return null
}
function horizontalOrPortraitStreak(logicBoardArray, isPortrait, isToWin) {
    let board = logicBoardArray
    let defender = isToWin ? 'X' : 'O'
    let attacker = isToWin ? 'O' : 'X'
    for (let i = 0; i < 3; i++) {
        let streakCounter = 0
        for (let j = 0; j < 3; j++) {
            let row = i
            let col = j
            if (!isPortrait) {
                row = j
                col = i
            }
            if (board[col][row].toString() === defender || (board[col][row].isEmpty && j > 0 && streakCounter < 1))
                break
            else if (board[col][row].toString() === attacker)
                streakCounter++
        }
        if (streakCounter === 2)
            for (let j = 0; j < 3; j++) {
                let row = i
                let col = j
                if (!isPortrait) {
                    row = j
                    col = i
                }
                if (board[col][row].isEmpty)
                    return [col, row]
            }
    }
    return null
}
function regularTurn(logicBoardArray) {
    let board = logicBoardArray
    if (turnNumber === 3) {
        if (board[1][1].toString() === 'X' ||
            board[2][1].toString() === 'X' && (board[0][0].toString() === board[2][1].toString() || board[0][1].toString() === board[2][1].toString()) ||
            board[1][0].toString() === 'X' && (board[1][0].toString() === board[0][2].toString() || board[1][0].toString() === board[2][1].toString() ||
            board[1][0].toString() === board[2][2].toString()) || (board[1][2].toString() === 'X' && (board[2][0].toString() === board[1][2].toString() ||
            board[2][1].toString() === board[1][2].toString())))
                return [2, 0]
        if (board[1][0].toString() === 'X' && (board[1][0].toString() === board[0][2].toString() || board[1][0].toString() === board[0][1].toString()) ||
        board[0][1].toString() === 'X' && (board[0][1].toString() === board[1][2].toString() || board[0][1].toString() === board[2][2].toString()))
                return [0, 0]
        if ((board[0][0].toString() === 'X' && board[2][2].toString() === 'X') || (board[2][0].toString() === 'X' && board[0][2].toString() === 'X'))
            return [1, 0]
    }
        for (let i = 0; i < 3; i++) 
        for (let j = 0; j < 3; j++) 
           if(board[i][j].isEmpty)
                return [i, j]

}

gamePlay()
