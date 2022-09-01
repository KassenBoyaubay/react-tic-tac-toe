import { useEffect, useState } from 'react'
import SquareWithRef from './Square'

type Scores = {
  [key: string]: number
}

const INITIAL_GAME_STATE = new Array(9).fill("")
const INITIAL_SCORES: Scores = { X: 0, O: 0 }
const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function Game() {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE)
  const [currentPlayer, setCurrentPlayer] = useState('X')
  const [scores, setScores] = useState(INITIAL_SCORES)

  useEffect(() => {
    const storedScores = localStorage.getItem('scores')
    if (storedScores) {
      setScores(JSON.parse(storedScores))
    }
  }, [])

  useEffect(() => {
    if (gameState === INITIAL_GAME_STATE) {
      return
    }
    checkForWinner()
  }, [gameState])

  const resetBoard = () => setGameState(INITIAL_GAME_STATE)

  const handleWin = () => {
    window.alert(`Player ${currentPlayer} won`)
    const newPlayerScore = scores[currentPlayer] + 1
    const newScores = { ...scores }
    newScores[currentPlayer] = newPlayerScore
    setScores(newScores)
    localStorage.setItem('scores', JSON.stringify(newScores))
    resetBoard()
  }

  const handleDraw = () => {
    window.alert('Draw')
    resetBoard()
  }

  const checkForWinner = () => {
    let roundWon = false

    for (let i = 0; i < WINNING_COMBOS.length; i++) {
      const winCombo = WINNING_COMBOS[i]

      let a = gameState[winCombo[0]]
      let b = gameState[winCombo[1]]
      let c = gameState[winCombo[2]]

      if ([a, b, c].includes('')) {
        continue
      }

      if (a === b && b === c) {
        roundWon = true
        break
      }
    }

    if (roundWon) {
      setTimeout(() => handleWin(), 500)
      return
    }

    if (!gameState.includes('')) {
      setTimeout(() => handleDraw(), 500)
      return
    }

    changePlayer()
  }

  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
  }

  const handleCellClick = (e: any) => {
    const cellIndex = Number(e.target.getAttribute('data-cell-index'))

    const currentValue = gameState[cellIndex]

    if (currentValue) {
      return
    }

    const newValues = [...gameState]
    newValues[cellIndex] = currentPlayer
    setGameState(newValues)
  }

  return (
    <div className="h-full p-8 text-slate-800 bg-gradient-to-r from-cyan-500 to-blue-500">
      <h1 className="text-center text-5xl mb-4 font-display text-white">Tic Tac Toe Game</h1>
      <h2 className={`text-center text-4xl mb-2 font-display ${currentPlayer === 'X' ? 'text-yellow-200' : 'text-fuchsia-300'}`}>
        {`Player's turn: ${currentPlayer}`}
      </h2>
      <div className='w-96 mx-auto'>
        <div className='grid grid-cols-3 gap-3 mb-2'>
          {gameState.map((player, index) => (
            <SquareWithRef key={index} {...{ index, player }} onClick={handleCellClick} />
          ))}
        </div>
        <div className='mx-auto flex justify-between'>
          <h3 className='text-3xl font-display text-yellow-200'>{`X wins: ${scores['X']}`}</h3>
          <h3 className='text-3xl font-display text-fuchsia-300'>{`${scores['O']} :wins O`}</h3>
        </div>
      </div>
    </div>
  )
}

export default Game
