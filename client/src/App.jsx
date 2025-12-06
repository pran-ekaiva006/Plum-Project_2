import React, { useState } from 'react'
import './index.css'
import './App.css'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HeroSection from './components/HeroSection.jsx'
import QuizRunner from './components/QuizRunner.jsx'
import { useQuizStore } from './state/quizStore.js'

export default function App() {
  const { topic, setTopic, reset } = useQuizStore()
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
      reset()
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <div className="container">
      <Navbar />
      <main className={`fade-container ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        {topic ? (
          <QuizRunner onReset={handleReset} />
        ) : (
          <HeroSection onStart={handleStart} />
        )}
      </main>
      <Footer />
    </div>
  )
}