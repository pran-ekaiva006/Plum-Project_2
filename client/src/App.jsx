import React, { useState } from 'react'
import './index.css'
import './App.css'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HeroSection from './components/HeroSection.jsx'

export default function App() {
  const [topic, setTopic] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleStart = (selectedTopic) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setTopic(selectedTopic)
      setIsTransitioning(false)
    }, 300)
  }

  const handleReset = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setTopic('')
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <div className="container">
      <Navbar />
      <main className={`fade-container ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        {topic ? (
          <div>
            <h2>Quiz for: {topic}</h2>
            <button onClick={handleReset}>Reset Quiz</button>
          </div>
        ) : (
          <HeroSection onStart={handleStart} />
        )}
      </main>
      <Footer />
    </div>
  )
}
