import React, { useState } from 'react';

const TOPICS = [
  { value: 'Wellness', icon: '🧘', description: 'Health & well-being practices', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { value: 'Tech Trends', icon: '💻', description: 'Latest in technology', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { value: 'Nutrition', icon: '🥗', description: 'Food & dietary science', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { value: 'Fitness', icon: '💪', description: 'Exercise & body health', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { value: 'Mental Health', icon: '🧠', description: 'Psychological wellness', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
];

export default function HeroSection({ onStart }) {
  const [selected, setSelected] = useState('');
  const [hoveredTopic, setHoveredTopic] = useState(null);

  const handleStartQuiz = () => {
    if (selected) {
      onStart(selected);
    }
  };

  return (
    <div className="hero-section">
      <div className="hero-container">
        <div className="hero-header">
          <div className="hero-badge-container">
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              <span>Powered by AI</span>
            </div>
          </div>
          
          <h1 className="hero-title">
            Test Your Knowledge
            <br />
            <span className="gradient-text">with AI-Powered Quizzes</span>
          </h1>
          
          <p className="hero-description">
            Choose a topic below and challenge yourself with 5 AI-generated multiple-choice questions.
            Get instant feedback and track your progress in real-time.
          </p>
        </div>

        <div className="topic-section">
          <h2 className="section-title">Select Your Topic</h2>
          <div className="topic-grid">
            {TOPICS.map(topic => (
              <button
                key={topic.value}
                className={`topic-card ${selected === topic.value ? 'selected' : ''}`}
                onClick={() => setSelected(topic.value)}
                onMouseEnter={() => setHoveredTopic(topic.value)}
                onMouseLeave={() => setHoveredTopic(null)}
                style={{
                  '--topic-gradient': topic.gradient
                }}
              >
                <div className="topic-icon-wrapper">
                  <div className="topic-icon">{topic.icon}</div>
                </div>
                <div className="topic-content">
                  <div className="topic-name">{topic.value}</div>
                  <div className="topic-description">{topic.description}</div>
                </div>
                {selected === topic.value && (
                  <div className="check-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="cta-section">
          <button 
            className={`start-btn ${!selected ? 'disabled' : ''}`}
            disabled={!selected} 
            onClick={handleStartQuiz}
          >
            <span className="btn-text">Start Quiz</span>
            <span className="btn-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </button>
          
          {selected && (
            <p className="selected-topic-text">
              Ready to test your knowledge on <strong>{selected}</strong>?
            </p>
          )}
        </div>

        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon-bg">
              <span className="feature-icon">🎯</span>
            </div>
            <div className="feature-content">
              <span className="feature-title">5 Questions</span>
              <span className="feature-description">Quick & focused</span>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-bg">
              <span className="feature-icon">✨</span>
            </div>
            <div className="feature-content">
              <span className="feature-title">AI Generated</span>
              <span className="feature-description">Always unique</span>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-bg">
              <span className="feature-icon">📊</span>
            </div>
            <div className="feature-content">
              <span className="feature-title">Instant Feedback</span>
              <span className="feature-description">Learn as you go</span>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon-bg">
              <span className="feature-icon">🔄</span>
            </div>
            <div className="feature-content">
              <span className="feature-title">Retry & Learn</span>
              <span className="feature-description">Practice makes perfect</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}