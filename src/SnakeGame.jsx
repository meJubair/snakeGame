import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const ROWS = 20;
const COLS = 20;
const CELL_SIZE = 32;
const INITIAL_SPEED = 400;

const getRandomCoord = () => {
  return {
    x: Math.floor(Math.random() * COLS),
    y: Math.floor(Math.random() * ROWS),
  };
};

Modal.setAppElement('#root');
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const SnakeGame = () => {

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);

  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(getRandomCoord());
  const [direction, setDirection] = useState('RIGHT');
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPaused, setIsPaused] = useState(false);
  const [intervalId, setIntervalId] = useState(null); // New state for interval ID

  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(!gameStarted);
    resetGame();
    closeModal();
  };

  /* Modal starts */ 
  
  
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(!modalIsOpen);
    resetGame();
  }

  /* Modal ends */



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
      clearInterval(intervalId); // Clear the interval first
      openModal();
      resetGame(); // Now reset the game
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

  useEffect(() => {
    const handleSwipe = (event) => {
      const { clientX, clientY } = event.changedTouches[0];
      const deltaX = clientX - touchStartX;
      const deltaY = clientY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) setDirection('RIGHT');
        else setDirection('LEFT');
      } else {
        // Vertical swipe
        if (deltaY > 0) setDirection('DOWN');
        else setDirection('UP');
      }
    };

    document.addEventListener('touchstart', (event) => {
      setTouchStartX(event.touches[0].clientX);
      setTouchStartY(event.touches[0].clientY);
    });

    document.addEventListener('touchend', handleSwipe);

    return () => {
      document.removeEventListener('touchstart', (event) => {
        setTouchStartX(event.touches[0].clientX);
        setTouchStartY(event.touches[0].clientY);
      });
      document.removeEventListener('touchend', handleSwipe);
    };
  }, [touchStartX, touchStartY]);

  const handleButtonClick = (direction) => {
    setDirection(direction);
  };

  return (
    <>
{/*      <div id="modalStart">
    
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Result"
      >
        
        
        <h2 style={{color:'black', textAlign:'center'}} ref={(_subtitle) => (subtitle = _subtitle)}>Welcome</h2>
        <div style={{color:'black', textAlign:'center'}}>Score: {score}</div>
        <p>Click start to play the game</p>
        <button style={{position:'absolute',right:'1.25rem', top:'1.25rem'}} id='modalBtnCls' onClick={startGame}>START PLAYING</button>
      </Modal>

    </div> */}

    <div id="modalEnd">
    
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Result"
      >
        
        <button style={{position:'absolute',right:'1.25rem', top:'1.25rem'}} id='modalBtnCls' onClick={closeModal}>X</button>
        <h2 style={{color:'black', textAlign:'center'}} ref={(_subtitle) => (subtitle = _subtitle)}>Game Over</h2>
        <div style={{color:'black', textAlign:'center'}}>Score: {score}</div>
        {score < 10 ? <p style={{color:'black', textAlign:'center'}}>Not a good score. Try again!</p> : <p style={{color:'black', textAlign:'center'}}>Good score. But you could do better!</p>}
      </Modal>

    </div>
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
          className='snake'
          key={index}
          style={{
            position: 'absolute',
            left: cell.x * CELL_SIZE,
            top: cell.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            
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

    {/* On-screen control buttons */}
    <div id="controlBar"  style={{marginTop: '10px' }}>
        <div style={{ width:'100%', textAlign: 'center', marginTop: '10px' }}>
          <button style={{ width:'50%', textAlign: 'center'}} onClick={() => handleButtonClick('UP')}>Up</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width:'100%', margin:'5px auto' }}>
          <button style={{ width:'25%' }} onClick={() => handleButtonClick('LEFT')}>Left</button>
          <button style={{ width:'25%' }} onClick={() => handleButtonClick('RIGHT')}>Right</button>
        </div>
        <div style={{ textAlign: 'center', marginTop:'0' }}>
          <button  style={{ width:'50%', textAlign: 'center'}} onClick={() => handleButtonClick('DOWN')}>Down</button>
        </div>
    </div>
    </>
  );
};

export default SnakeGame;
