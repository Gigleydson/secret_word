// React
import { useState, useEffect } from 'react'

// CSS
import './App.css'

// data
import { wordsList } from './data/words'

// components
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' }
]

const guessQtd = 3

function App() {
  const [count, setCount] = useState(0)

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)
  
  const [pickedWord, setPickedWord] = useState('')
  const [pickedCategory, setPickedCategory] = useState('')
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessQtd)
  const [score, setScrore] = useState(0)

  const pickWordAndCategory = () => {
    // pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return {word, category}
  }

  // start the secret word game
  const startGame = () => {
    // clear all letters
    clearLetterStates()

    // pick word and category
    const {word, category} = pickWordAndCategory()

    // create an array of letters
    let wordLetters = word.split('')

    // transform letters upercase to lowercase
    wordLetters = wordLetters.map((letter) => letter.toLowerCase())

    // fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }

  // process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    // check if letter has already been utilized
    if (
        guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)
    ) {
        return
      }
    
    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetter) => [
        ...actualGuessedLetter,
        normalizedLetter
      ]) 
    } else {
      setWrongLetters((actualWrongLetter) => [
        ...actualWrongLetter,
        normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses -1)
    }
  }

  // clear all letters
  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  // check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {

      // reset all states
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  // check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    // win condition
    if (guessedLetters.length === uniqueLetters.length) {
      // add score
      setScrore((actualScore) => (actualScore += 100))

      // restar game with new word
      startGame()
    }

  }, [guessedLetters])

  // Restart game
  const retryGame = () => {
    setScrore(0)
    setGuesses(guessQtd)

    setGameStage(stages[0].name)
  }

  return (
    <>
      <div className='App'>
        {gameStage == 'start' && <StartScreen startGame={startGame} />}
        {gameStage == 'game' && 
          <Game 
            verifyLetter={verifyLetter} 
            pickedWord={pickedWord}
            pickedCategory={pickedCategory}
            letters={letters}
            guessedLetters={guessedLetters}
            wrongLetters={wrongLetters}
            guesses={guesses}
            score={score}
          />}
        {gameStage == 'end' && <GameOver retryGame={retryGame} score={score} />}
      </div>
    </>
  )
}

export default App
