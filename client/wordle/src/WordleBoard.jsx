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

  const guesses = Array.from({ length: ROWS }, () => Array(COLS).fill(''));

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      // Handle key presses for guessing
      if (event.key === 'Enter') {
        setCurrentGuess((prev) => {
        console.log('Submit guess:', prev.join('')); // Correct way
        return []; // Reset after submit
        }
        );
      } else if (event.key === 'Backspace') {
        setCurrentGuess((prev) => {
          console.log(prev.join(''));
          return prev.slice(0, -1)});
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        setCurrentGuess((prev) => {
          if (prev.length < COLS) {
            // handle prev being null
            if (!prev) {
              return [event.key.toLowerCase()];
            }
            const updatedGuess = [...prev, event.key.toLowerCase()];
            console.log(updatedGuess.join(''));
            return updatedGuess;
          }
          console.log('Guess is full');
          return prev; // Do not add more letters if guess is full
          });
    }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="wordle-board">
      <button onClick={fetchWord} className="fetch-word-button">
        <div>
          {word && <p> Fetched word: {word}</p>}
        </div>
      </button>
      <button onMouseEnter={fetchWord} className="fetch-word-button">
        <div>
          {word && <p> Hover to fetch word: {word}</p>}
        </div>
      </button>
      {[...Array(ROWS)].map((_, rowIdx) => (
        <div className="wordle-row" key={rowIdx}>
          {[...Array(COLS)].map((_, colIdx) => (
            <div className="wordle-box" key={colIdx}>
              {word && word[rowIdx * COLS + colIdx]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
  }
  export default WordleBoard;