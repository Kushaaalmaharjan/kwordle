import { useState,useEffect } from 'react'
import './App.css'


async function getWord(){
  const res = await fetch('https://random-word-api.herokuapp.com/word?length=5')
  const data = await res.json()
  return data[0].toUpperCase()
}

function App() {
  const [targetWord, setTargetWord] = useState('')
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState([])

  useEffect(() => {
    getWord().then(setTargetWord)
  }, [])

  function checkGuess() {
    if(guesses.length >= 5){
      alert('You have already made 5 guesses. Game over!')
      return
    }

    if(guess.length !== 5){
      alert('Please enter a 5-letter word.')
      return
    }

    setGuesses(prev => [...prev, guess])
    setGuess('')
  }

  // Returns an array of 5 color strings for a full guess word
  function getColors(guessWord) {
    if (!guessWord || targetWord.length !== 5) return ["", "", "", "", ""]

    const target = targetWord.trim()
    const colors = Array(5).fill("gray")
    const targetLetterCount = {}

    // First pass: mark greens and count remaining target letters
    for (let i = 0; i < 5; i++) {
      if (guessWord[i] === target[i]) {
        colors[i] = "green"
      } else {
        targetLetterCount[target[i]] = (targetLetterCount[target[i]] || 0) + 1
      }
    }

    // Second pass: mark yellows, consuming available letter counts
    for (let i = 0; i < 5; i++) {
      if (colors[i] === "green") continue
      const letter = guessWord[i]
      if (targetLetterCount[letter] > 0) {
        colors[i] = "yellow"
        targetLetterCount[letter]--
      }
    }

    return colors
  }

  console.log('Target Word:', targetWord) 

  return (
    <>
    <div className="Header">
      <h1>KORDLE</h1>
    </div>

    <section className="typing">
      <form onSubmit={(e) => { e.preventDefault(); checkGuess(); }}>
      <input type="text" maxLength={5} className="guess-input" placeholder="Enter your guess" disabled={guesses.length >= 5} value={guess} onChange={(e) => setGuess(e.target.value.toUpperCase())}/>
      {/* <input type="submit" value="Submit" className= "guess-btn" id="guess-btn" disabled={guesses.length >= 5} onClick={checkGuess} /> */}
      </form>
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
    </>
  )        
}

export default App