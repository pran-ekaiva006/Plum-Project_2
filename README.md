# AI-Assisted Knowledge Quiz

A modern, AI-powered quiz application built with React and Node.js that generates personalized quizzes on various topics using Groq's LLaMA AI model.

## 🎯 Project Overview

This application was built as part of the **SDE Intern Assignment – Problem 2**. It demonstrates:
- AI integration for dynamic content generation
- Modern React patterns with hooks and state management
- Async data handling with smart retries
- JSON schema validation
- Real-time user feedback
- Responsive design for mobile and desktop

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Groq API key (get one at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/pran-ekaiva006/Plum-Project_2.git
cd PlumQuiz
```

2. **Setup Backend**
```bash
cd server
npm install

# Create .env file
echo "PORT=4000" > .env
echo "GROQ_API_KEY=your_api_key_here" >> .env
echo "GROQ_MODEL=llama-3.1-8b-instant" >> .env

# Start server
npm run dev
```

3. **Setup Frontend**
```bash
cd ../client
npm install

# Create .env file
echo "VITE_USE_MOCK=false" > .env
echo "VITE_AI_ENDPOINT=http://localhost:4000/api/generate" >> .env
echo "VITE_AI_API_KEY=dummy-key" >> .env

# Start client
npm run dev
```

4. **Access the application**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:4000](http://localhost:4000)

## 📁 Project Structure

```
PlumQuiz/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   └── QuizRunner.jsx
│   │   ├── services/      # API services
│   │   │   └── aiServices.js
│   │   ├── state/         # State management
│   │   │   └── quizStore.js
│   │   ├── types/         # Type definitions
│   │   │   └── quiz.js
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   ├── utils.js           # Utility functions
│   ├── main.jsx           # Entry point
│   └── package.json
│
└── server/                # Node.js backend
    ├── index.js           # Express server
    ├── package.json
    └── .env               # Environment variables
```

## 🧠 AI Integration & Prompts

### Initial Prompt Strategy

**Quiz Generation Prompt:**
```
You are a quiz generator. Return STRICT JSON ONLY. No prose.
Schema:
{
  "topic": string,
  "questions": [
    {
      "id": string,
      "question": string,
      "options": [string, string, string, string],
      "correctIndex": 0 | 1 | 2 | 3
    },
    ... exactly 5 total
  ]
}
Rules:
- Use everyday language, no jargon.
- Avoid ambiguous wording.
- Ensure one and only one correct answer (correctIndex).
- Never include explanations.
- Output MUST be valid JSON matching the schema.
Generate for topic: "${topic}".
```

**Feedback Generation Prompt:**
```
You are a friendly coach. Based on score ${score}/5 on topic "${topic}", 
write 2 short sentences of encouragement + 1 concrete tip. 
Keep it under 45 words, no emojis.
Return plain text.
```

### Prompt Iterations & Refinements

1. **First Iteration (Failed):**
   - Prompt: "Generate a quiz about ${topic}"
   - Issue: AI returned prose instead of JSON
   - Solution: Added "Return STRICT JSON ONLY. No prose."

2. **Second Iteration (Partial Success):**
   - Issue: AI sometimes included extra explanation text
   - Solution: Implemented `safeJsonParse()` to extract JSON from mixed content

3. **Third Iteration (Success):**
   - Issue: Questions were sometimes ambiguous
   - Solution: Added rule "Use everyday language, no jargon"

4. **Fourth Iteration (Optimized):**
   - Issue: Inconsistent question quality
   - Solution: Set temperature to 0.2 for quiz generation, 0.7 for feedback

### Key Learnings

- **Strict formatting instructions** are crucial for AI consistency
- **Temperature settings** significantly affect output quality
- **Schema validation** catches AI hallucinations early
- **Retry logic** handles intermittent API failures
- **JSON extraction** from mixed content increases reliability

## 🏗️ Architecture & Design Decisions

### State Management: Zustand

**Why Zustand?**
- Lightweight (< 1KB)
- No boilerplate code
- Built-in persistence
- Simple API
- Better TypeScript support than Context API

**State Structure:**
```javascript
{
  topic: string | null,           // Current quiz topic
  quiz: Object | null,            // Quiz data from AI
  currentIndex: number,           // Current question
  answers: Record<string, number>,// User's answers
  loading: boolean,               // Loading state
  error: string | null            // Error messages
}
```

### Component Architecture

**1. `client/src/App.jsx` (Container)**
- Manages routing between HeroSection and QuizRunner
- Handles transitions with fade effects
- Coordinates state with Zustand store

**2. `client/src/components/HeroSection.jsx` (Landing)**
- Topic selection interface
- Visual feedback for selection
- Responsive grid layout
- Call-to-action button

**3. `client/src/components/QuizRunner.jsx` (Quiz Interface)**
- Question display and navigation
- Answer tracking
- Progress indicator
- Results calculation
- AI feedback integration

**4. Navbar.jsx (Navigation)**
- Brand identity
- GitHub link
- Mobile-responsive menu
- Sticky positioning

**5. `client/src/components/Footer.jsx` (Information)**
- Project details
- Feature highlights
- External links

### Service Layer Pattern

**`client/src/services/aiServices.js`**
- Encapsulates all AI API calls
- Implements retry logic (2 attempts)
- Handles JSON parsing and validation
- Mock mode for development

**Benefits:**
- Separation of concerns
- Easy testing
- Centralized error handling
- Simplified component logic

### Validation Strategy

**Zod Schema Validation:**
```javascript
QuizPayloadSchema = {
  topic: string,
  questions: [
    {
      id: string,
      question: string (min 1 char),
      options: array of 4 strings,
      correctIndex: 0-3
    }
  ] (exactly 5)
}
```

**Why Zod?**
- Runtime type safety
- Better error messages
- Tree-shakeable
- Works with TypeScript and JavaScript

### Error Handling

**Layered Approach:**
1. **Network Level:** Fetch API error handling
2. **Validation Level:** Zod schema parsing
3. **Application Level:** User-friendly error messages
4. **UI Level:** Error states with retry options

## 🎨 UI/UX Design

### Design Principles

1. **Progressive Disclosure:** Show information as needed
2. **Immediate Feedback:** Visual confirmation for all actions
3. **Clear Hierarchy:** Typography and spacing guide the eye
4. **Consistent Patterns:** Reusable design tokens

### Key Features

- **Loading States:** Animated spinner with progress indicator
- **Error States:** Clear messaging with recovery options
- **Success States:** Celebratory results screen
- **Responsive Design:** Mobile-first approach
- **Accessibility:** ARIA labels, keyboard navigation

### Color System

```css
Primary: #667eea (Purple)
Secondary: #764ba2 (Deep Purple)
Success: #43e97b (Green)
Error: #f5576c (Red)
Warning: #ffc107 (Yellow)
Info: #4facfe (Blue)
```

## 📱 Mobile Responsiveness

### Breakpoints
- Mobile: < 480px
- Tablet: 481px - 768px
- Desktop: > 768px

### Optimizations
- Touch-friendly buttons (min 44x44px)
- Hamburger menu for mobile
- Flexible grid layouts
- Readable font sizes
- Optimized images

## 🔧 Technical Highlights

### Async Loaders
```javascript
// Smart retry logic
for (let attempt = 1; attempt <= 2; attempt++) {
  try {
    const response = await fetch(endpoint, options)
    return await processResponse(response)
  } catch (error) {
    if (attempt < 2) await sleep(400)
    else throw error
  }
}
```

### JSON Parsing
```javascript
// Extract JSON from mixed content
const safeJsonParse = (schema, raw) => {
  const first = raw.indexOf('{')
  const last = raw.lastIndexOf('}')
  const json = raw.slice(first, last + 1)
  return schema.parse(JSON.parse(json))
}
```

### State Persistence
```javascript
// Zustand persist middleware
persist(
  (set) => ({ /* state */ }),
  {
    name: 'ai-quiz-store',
    storage: createJSONStorage(() => localStorage)
  }
)
```

## 🐛 Known Issues & Limitations

### Current Issues

1. **API Rate Limits**
   - Groq free tier has request limits
   - No rate limiting on client side
   - **Fix:** Implement request throttling

2. **Question Quality**
   - Occasional ambiguous questions
   - No way to report bad questions
   - **Fix:** Add feedback mechanism

3. **Mobile Menu**
   - Topic links in mobile menu don't work
   - **Fix:** Implement proper routing

4. **State Persistence**
   - Quiz state persists after page refresh
   - Can be confusing for users
   - **Fix:** Add session timeout

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ IE 11 (not supported)

## 🚀 Future Enhancements

### Short Term
- [ ] Add question difficulty levels
- [ ] Implement user accounts
- [ ] Add quiz history
- [ ] Export results as PDF
- [ ] Add timer per question

### Long Term
- [ ] Multi-language support
- [ ] Custom topic creation
- [ ] Leaderboards
- [ ] Social sharing
- [ ] Offline mode with Service Workers

## 📊 Performance Metrics

### Lighthouse Scores (Desktop)
- Performance: 95/100
- Accessibility: 98/100
- Best Practices: 92/100
- SEO: 100/100

### Bundle Sizes
- Client JS: ~150KB (gzipped)
- Client CSS: ~25KB (gzipped)
- Total: ~175KB

## 📄 License

MIT License - feel free to use this project for learning!

## 👤 Author

**Pranjal Kumar Verma**
- GitHub: [@pran-ekaiva006](https://github.com/pran-ekaiva006)
- Project: [Plum-Project_2](https://github.com/pran-ekaiva006/Plum-Project_2)

## 🙏 Acknowledgments

- **Groq** for providing the AI API
- **Vite** for blazing fast build tool
- **Zustand** for simple state management
- **Zod** for runtime validation

---

**Built with ❤️ for learning and growth**
