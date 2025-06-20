import React, { useState } from 'react';
import './WordleBoard.css';

const ROWS = 6;
const COLS = 5;

function WordleBoard() {
  const [word, setWord] = useState('');

  const fetchWord = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/word');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setWord(data.word);
      console.log('Fetched word:', data.word);
    } catch (error) {
      console.error('Error fetching word:', error);
    }
  };

  const [currentGuess, setCurrentGuess] = useState([]);

  const [guesses, setGuesses] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill('')));

  const [nGuesses, setNGuesses] = useState(0);

  const [victory, setVictory] = useState(false);

  function checkGuess(guess, word) {
    if (guess.length !== COLS) {
      console.error('Guess must be 5 letters long. this should not happen');
      return;
    }
    if (!word) {
      console.error('No word to compare against. Please fetch a word first.');
      return;
    }
    const guessArray = guess.split('');
    const wordArray = word.split('');
    const result = guessArray.map((letter, index) => {
      if (letter === wordArray[index]) {
        return { letter, status: 'correct' }; // Correct letter in the correct position
      }
      if (wordArray.includes(letter)) {
        return { letter, status: 'present' }; // Correct letter but in the wrong position
      }
      return { letter, status: 'absent' }; // Letter not in the word
    });
    console.log('Guess result:', result);
    return result;
  }

  // Fetch a word when the component mounts
  React.useEffect(() => {
    fetchWord();
  }, []);

  React.useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (currentGuess.length !== COLS) {
        console.log('Guess must be 5 letters long');
        return;
      }
      // check guess vs word
      const guessResult = checkGuess(currentGuess.join(''), word);
      //console.log('Guess result:', guessResult.join(' '));
      // Update guesses state with the current guess
      if (guessResult.some(item => item.status === 'correct')) {
        console.log('Congratulations! You guessed the word!');
      } else {
        console.log('Keep trying!');
      }
      setGuesses((prevGuesses) => {
        const newGuesses = [...prevGuesses];
        // Find the first empty row to insert the guess
        const firstEmptyRow = newGuesses.findIndex(row => row.every(cell => cell === ''));
        if (firstEmptyRow !== -1) {
          newGuesses[firstEmptyRow] = [...currentGuess];
        }
        //console.log('Updated guesses:', newGuesses);
        return newGuesses;
      });
      setNGuesses((prev) => prev + 1);
      setCurrentGuess([]);
    } else if (event.key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(event.key)) {
      setCurrentGuess((prev) => {
        if (prev.length < COLS) {
          return [...prev, event.key.toLowerCase()];
        }
        return prev;
      });
      setGuesses((prevGuesses) => {
        prevGuesses[nGuesses] = [...currentGuess, event.key.toLowerCase()];
        return [...prevGuesses];
      });
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [currentGuess]);

  return (
    <div className="wordle-board">
      <h1>Wordle Game</h1>
      <h3> Word: {word}</h3>
      <h3> Current  Guess: {currentGuess.join('')}</h3>
      <h3> Guesses: {guesses}</h3>
      
      {[...Array(ROWS)].map((_, rowIdx) => (
        <div className="wordle-row" key={rowIdx}>
          {[...Array(COLS)].map((_, colIdx) => (
            <div className="wordle-box" key={colIdx}>
              {guesses[rowIdx][colIdx] || ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  }
  export default WordleBoard;