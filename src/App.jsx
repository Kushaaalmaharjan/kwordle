import { useState, useEffect } from 'react'
import './App.css'

async function getWord() {
  const res = await fetch('https://random-word-api.herokuapp.com/word?length=5')
  const data = await res.json()
  return data[0].toUpperCase()
}

function App() {
  const [targetWord, setTargetWord] = useState('')
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState([])
  const [won, setWon] = useState(false)

  useEffect(() => {
    getWord().then(setTargetWord)
  }, [])

  function restart() {
    setGuesses([])
    setGuess('')
    setWon(false)
    getWord().then(setTargetWord)
  }

  function checkGuess() {
    if (won || guesses.length >= 5) return

    if (guess.length !== 5) {
      alert('Please enter a 5-letter word.')
      return
    }

    const newGuesses = [...guesses, guess]
    setGuesses(newGuesses)
    setGuess('')

    if (guess === targetWord) {
      setWon(true)
    }
  }

  // Returns an array of 5 color strings for a full guess word
  function getColors(guessWord) {
    if (!guessWord || targetWord.length !== 5) return ['', '', '', '', '']

    const target = targetWord.trim()
    const colors = Array(5).fill('gray')
    const targetLetterCount = {}

    for (let i = 0; i < 5; i++) {
      if (guessWord[i] === target[i]) {
        colors[i] = 'green'
      } else {
        targetLetterCount[target[i]] = (targetLetterCount[target[i]] || 0) + 1
      }
    }

    for (let i = 0; i < 5; i++) {
      if (colors[i] === 'green') continue
      const letter = guessWord[i]
      if (targetLetterCount[letter] > 0) {
        colors[i] = 'yellow'
        targetLetterCount[letter]--
      }
    }

    return colors
  }

  const isDisabled = won || guesses.length >= 5

  console.log("targetword: ", targetWord)

  return (
    <>
      <div className="Header">
        <h1>KORDLE</h1>
      </div>

      <section className="typing">
        <input
          type="text"
          maxLength={5}
          className="guess-input"
          placeholder="Enter your guess"
          disabled={isDisabled}
          value={guess}
          onChange={(e) => setGuess(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && checkGuess()}
        />
        <input
          type="submit"
          value="Submit"
          className="guess-btn"
          disabled={isDisabled}
          onClick={checkGuess}
        />
      </section>

      <section className="display" id="display">
        {[0, 1, 2, 3, 4].map((row) => {
          const colors = getColors(guesses[row])
          return (
            <section className="row" key={row}>
              {[0, 1, 2, 3, 4].map((col) => (
                <div className={`box ${colors[col]}`} key={col}>
                  {guesses[row]?.[col]}
                </div>
              ))}
            </section>
          )
        })}
      </section>

      {won && (
        <div className="win-overlay">
          <div className="win-modal">
            <h2>🎉 You got it!</h2>
            <p>The word was <strong>{targetWord}</strong></p>
            <button className="restart-btn" onClick={restart}>Play Again</button>
          </div>
        </div>
      )}
    </>
  )
}

export default App