import React, { useEffect, useMemo, useState } from 'react'
import { useQuizStore } from '../state/quizStore.js'
import { generateQuiz, generateFeedback } from '../services/aiServices.js'

export default function QuizRunner({ onReset }) {
  const { 
    topic, 
    quiz, 
    setQuiz, 
    currentIndex, 
    next, 
    prev, 
    answers, 
    answer, 
    loading, 
    setLoading, 
    setError, 
    error 
  } = useQuizStore()
  
  const [feedback, setFeedback] = useState(null)
  const [fbLoading, setFbLoading] = useState(false)

  useEffect(() => {
    if (!topic || quiz) return
    
    const loadQuiz = async () => {
      try {
        setLoading(true)
        setError(null)
        const q = await generateQuiz(topic)
        setQuiz(q)
      } catch (e) {
        setError(e?.message ?? 'Failed to generate quiz')
      } finally {
        setLoading(false)
      }
    }
    
    loadQuiz()
  }, [topic, quiz, setQuiz, setLoading, setError])

  const completed = useMemo(() => {
    return quiz ? Object.keys(answers).length === quiz.questions.length : false
  }, [quiz, answers])

  const score = useMemo(() => {
    if (!completed || !quiz) return 0
    return quiz.questions.reduce((acc, qq) => {
      return acc + ((answers[qq.id] === qq.correctIndex) ? 1 : 0)
    }, 0)
  }, [completed, quiz, answers])

  if (!topic) return null

  const regenerate = async () => {
    if (!topic) return
    try {
      setLoading(true)
      setError(null)
      setFeedback(null)
      const q = await generateQuiz(topic)
      setQuiz(q)
    } catch (e) {
      setError(e?.message ?? 'Failed to generate quiz')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-loader">
          <div className="loader-animation">
            <div className="spinner-large"></div>
            <div className="loader-glow"></div>
          </div>
          <h2 className="loader-title">Generating Your Quiz</h2>
          <p className="loader-subtitle">AI is crafting personalized questions for you...</p>
          <div className="loader-progress-bar">
            <div className="loader-progress-fill"></div>
          </div>
          <div className="loader-stats">
            <div className="loader-stat">
              <span className="loader-stat-icon">🤖</span>
              <span>AI Processing</span>
            </div>
            <div className="loader-stat">
              <span className="loader-stat-icon">✅</span>
              <span>Validating Content</span>
            </div>
            <div className="loader-stat">
              <span className="loader-stat-icon">📝</span>
              <span>5 Questions</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Oops! Something went wrong</h2>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={regenerate}>
              <span>🔄</span>
              <span>Try Again</span>
            </button>
            <button className="btn btn-secondary" onClick={onReset}>
              <span>🏠</span>
              <span>Change Topic</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!quiz) return null

  const q = quiz.questions[currentIndex]
  const chosen = answers[q.id]
  const isAnswered = chosen !== undefined

  const progress = Math.round(((currentIndex + 1) / quiz.questions.length) * 100)
  const answeredCount = Object.keys(answers).length

  const getFeedback = async () => {
    setFbLoading(true)
    try {
      const fb = await generateFeedback(quiz.topic, score)
      setFeedback(fb.message)
    } catch (e) {
      setFeedback("Couldn't fetch feedback right now. Try again later.")
    } finally {
      setFbLoading(false)
    }
  }

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        {/* Header */}
        <div className="quiz-header">
          <div className="quiz-topic-badge">
            <span className="topic-icon">📚</span>
            <span>{quiz.topic}</span>
          </div>
          <button className="btn-icon-only" onClick={onReset} title="Change Topic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>

        {/* Progress Section */}
        <div className="quiz-progress-section">
          <div className="progress-info">
            <h2 className="progress-title">Question {currentIndex + 1} of {quiz.questions.length}</h2>
            <p className="progress-subtitle">{answeredCount} answered · {quiz.questions.length - answeredCount} remaining</p>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
                <span className="progress-percentage">{progress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="question-section">
          <div className="question-number">Q{currentIndex + 1}</div>
          <h3 className="question-text">{q.question}</h3>
          
          <div className="options-grid">
            {q.options.map((opt, idx) => {
              const isChosen = chosen === idx
              const isCorrect = completed && q.correctIndex === idx
              const isWrong = completed && isChosen && !isCorrect
              
              let className = 'option-button'
              if (completed) {
                if (isCorrect) className += ' option-correct'
                else if (isWrong) className += ' option-wrong'
                else className += ' option-disabled'
              } else if (isChosen) {
                className += ' option-selected'
              }
              
              return (
                <button
                  key={idx}
                  className={className}
                  onClick={() => !completed && answer(q.id, idx)}
                  disabled={completed}
                >
                  <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="option-text">{opt}</span>
                  {completed && isCorrect && (
                    <span className="option-status option-status-correct">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  )}
                  {isWrong && (
                    <span className="option-status option-status-wrong">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {!completed && !isAnswered && (
            <div className="warning-message">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
              </svg>
              <span>Please select an answer to continue</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="quiz-navigation">
          <div className="nav-buttons">
            <button 
              className="btn btn-secondary"
              onClick={prev} 
              disabled={currentIndex === 0}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Previous</span>
            </button>
            <button 
              className="btn btn-secondary"
              onClick={next} 
              disabled={currentIndex === quiz.questions.length - 1}
            >
              <span>Next</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          <button className="btn btn-regenerate" onClick={regenerate}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            <span>New Questions</span>
          </button>
        </div>

        {/* Question Dots */}
        {!completed && (
          <div className="question-indicators">
            {quiz.questions.map((question, idx) => {
              const isCurrentQuestion = idx === currentIndex
              const isQuestionAnswered = answers[question.id] !== undefined
              
              let className = 'question-dot'
              if (isCurrentQuestion) className += ' dot-active'
              if (isQuestionAnswered) className += ' dot-answered'
              
              return (
                <button
                  key={question.id}
                  className={className}
                  onClick={() => useQuizStore.setState({ currentIndex: idx })}
                  title={`Question ${idx + 1}${isQuestionAnswered ? ' (answered)' : ''}`}
                >
                  {isQuestionAnswered ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Results */}
        {completed && (
          <div className="results-section">
            <div className="results-header">
              <div className="results-score">
                <div className={`score-circle ${score >= 3 ? 'score-pass' : 'score-fail'}`}>
                  <svg className="score-ring" viewBox="0 0 36 36">
                    <path className="score-ring-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="score-ring-fill"
                      strokeDasharray={`${(score / quiz.questions.length) * 100}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="score-text">
                    <span className="score-number">{score}</span>
                    <span className="score-total">/ {quiz.questions.length}</span>
                  </div>
                </div>
                <div className="score-info">
                  <h3 className="score-title">
                    {score === 5 ? '🎉 Perfect Score!' : 
                     score >= 4 ? '🌟 Excellent Work!' :
                     score >= 3 ? '👍 Good Job!' : 
                     '💪 Keep Practicing!'}
                  </h3>
                  <p className="score-message">
                    {score === 5 ? 'Outstanding! You got every question right!' :
                     score >= 4 ? 'Great performance! You really know your stuff.' :
                     score >= 3 ? 'Nice work! You passed the quiz.' :
                     'Don\'t give up! Review and try again.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="results-actions">
              <button 
                className="btn btn-feedback"
                onClick={getFeedback} 
                disabled={fbLoading}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{fbLoading ? 'Loading...' : 'Get AI Feedback'}</span>
              </button>
              <button className="btn btn-danger" onClick={onReset}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Start Over</span>
              </button>
            </div>
            
            {feedback && (
              <div className="feedback-card">
                <div className="feedback-header">
                  <span className="feedback-icon">🤖</span>
                  <span className="feedback-title">AI Feedback</span>
                </div>
                <p className="feedback-text">{feedback}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
