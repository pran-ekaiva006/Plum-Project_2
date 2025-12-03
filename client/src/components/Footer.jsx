import React from 'react';

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12 0L14.59 7.41L22 10L14.59 12.59L12 20L9.41 12.59L2 10L9.41 7.41L12 0Z" />
    <path d="M19 14L20.35 17.65L24 19L20.35 20.35L19 24L17.65 20.35L14 19L17.65 17.65L19 14Z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-badge">
            <SparkleIcon />
            <span>AI-Powered Quiz Platform</span>
          </div>
          <p className="footer-description">
            Built for <strong>SDE Intern Assignment – Problem 2</strong>
          </p>
        </div>

        <div className="footer-features">
          <div className="feature-tag">
            <CodeIcon />
            <span>Async Loaders</span>
          </div>
          <div className="feature-tag">
            <CodeIcon />
            <span>Smart Retries</span>
          </div>
          <div className="feature-tag">
            <CodeIcon />
            <span>JSON Schema Validation</span>
          </div>
          <div className="feature-tag">
            <CodeIcon />
            <span>Real-time Feedback</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} AI Quiz · Made with <HeartIcon /> for learning
          </p>
          <div className="footer-links">
            <a 
              href="https://github.com/pran-ekaiva006/Plum-Project_2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              View Source
            </a>
            <span className="footer-divider">•</span>
            <a 
              href="https://groq.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              Powered by Groq
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}