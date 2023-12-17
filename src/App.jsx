import { useState } from 'react'
import './App.css'
import SnakeGame from './SnakeGame'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SnakeGame/>
    </>
  )
}

export default App
