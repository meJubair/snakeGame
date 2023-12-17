import React, { useState, useEffect } from 'react';

const ROWS = 40;
const COLS = 40;
const CELL_SIZE = 20;
const INITIAL_SPEED = 800;

const getRandomCoord = () => {
  return {
    x: Math.floor(Math.random() * COLS),
    y: Math.floor(Math.random() * ROWS),
  };
};

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(getRandomCoord());
  const [direction, setDirection] = useState('RIGHT');
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPaused, setIsPaused] = useState(false);
  const [intervalId, setIntervalId] = useState(null); // New state for interval ID

  useEffect(() => {
    const id = setInterval(() => {
      if (!isPaused) {
        const head = { ...snake[0] };
        switch (direction) {
          case 'UP':
            head.y--;
            break;
          case 'DOWN':
            head.y++;
            break;
          case 'LEFT':
            head.x--;
            break;
          case 'RIGHT':
            head.x++;
            break;
          default:
            break;
        }
        checkCollision(head);
        if (!isPaused) {
          const newSnake = [...snake];
          if (head.x === food.x && head.y === food.y) {
            setFood(getRandomCoord());
            setScore((prevScore) => prevScore + 1);
            increaseSpeed();
          } else {
            newSnake.pop();
          }
          newSnake.unshift(head);
          setSnake(newSnake);
        }
      }
    }, speed);

    setIntervalId(id); // Save interval ID to state

    return () => clearInterval(id);
  }, [snake, direction, food, score, speed, isPaused]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setDirection('UP');
          break;
        case 'ArrowDown':
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
          setDirection('LEFT');
          break;
        case 'ArrowRight':
          setDirection('RIGHT');
          break;
        case 'p':
          setIsPaused((prevPaused) => !prevPaused);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPaused]);

  const checkCollision = (head) => {
    if (
      head.x < 0 ||
      head.x >= COLS ||
      head.y < 0 ||
      head.y >= ROWS ||
      snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      clearInterval(intervalId); // Use the interval ID from state
      alert(`Game Over! Your Score: ${score}`);
      resetGame();
    }
  };

  const increaseSpeed = () => {
    setSpeed((prevSpeed) => Math.max(50, prevSpeed - 5));
  };

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomCoord());
    setDirection('RIGHT');
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
  };

  return (
    <>
    <div id='topBar'>
    <button
      style={{
        position: 'relative',
        bottom:'0.5rem',
        fontSize: '18px',
        padding: '5px',
      }}
    >
      Score: {score}
    </button>

    <button
      style={{
        position: 'relative',
        bottom:'0.5rem',
        fontSize: '18px',
        padding: '5px',
      }}
      onClick={() => setIsPaused((prevPaused) => !prevPaused)}
    >
      {isPaused ? 'Resume' : 'Pause'}
    </button>

    <button
      style={{
        position: 'relative',
        bottom:'0.5rem',
        fontSize: '18px',
        padding: '5px',
      }}
      onClick={resetGame}
    >
      Reset Game
    </button>
    
    </div>
    <div
      style={{
        position: 'relative',
        width: COLS * CELL_SIZE,
        height: ROWS * CELL_SIZE,
        border: '4px solid gray',
        overflow: 'hidden',
      }}
      tabIndex="0"
    >
      {snake.map((cell, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: cell.x * CELL_SIZE,
            top: cell.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            backgroundColor: 'darkgreen',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: food.x * CELL_SIZE,
          top: food.y * CELL_SIZE,
          width: CELL_SIZE,
          height: CELL_SIZE,
          backgroundColor: 'tomato',
        }}
      />

    </div>
    </>
  );
};

export default SnakeGame;
