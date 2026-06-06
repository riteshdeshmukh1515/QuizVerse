# 🚀 Quick Demo Guide

## Getting Started

1. **Start the development server:**
```bash
npm run dev
```

2. **Open your browser:**
Navigate to `http://localhost:5173`

---

## 🎯 Demo Accounts

### Student Account
- **Email:** `student@quizverse.com`
- **Password:** `student123`

### Admin Account
- **Email:** `admin@quizverse.com`
- **Password:** `admin123`

---

## 📋 Feature Walkthrough

### 1. Landing Page (`/`)
- Beautiful hero section with animations
- Feature highlights
- Testimonials
- Call-to-action buttons

### 2. Authentication Flow
- **Login** (`/login`): Use demo credentials
- **Register** (`/register`): Create new account
- **Forgot Password** (`/forgot-password`): Password reset flow

### 3. Student Dashboard (`/dashboard`)
- Welcome message
- Stats cards (quizzes taken, average score, best score, accuracy)
- Performance trend chart
- Category performance pie chart
- Quick action cards
- Recent attempts list

### 4. Browse Quizzes (`/browse`)
- Search quizzes by title, description, or tags
- Filter by category (Programming, Aptitude, Mathematics, Science, GK)
- Filter by difficulty (Easy, Medium, Hard)
- Sort by newest or most questions
- Beautiful quiz cards with emojis and gradients

### 5. Take a Quiz (`/quiz/:id`)
- Click any quiz card to start
- Real-time countdown timer
- Question navigator showing progress
- Multiple question types:
  - Multiple Choice (MCQ)
  - True/False
  - Fill in the Blank
- Negative marking support
- Auto-submit when time expires
- Confirm submit modal

### 6. View Results (`/result/:id`)
- Score card with percentage
- Stats: correct, wrong, skipped
- AI-generated performance feedback
- Detailed answer review with explanations
- Download certificate (if passed)
- Share result link
- Retry quiz option

### 7. Leaderboard (`/leaderboard`)
- Global rankings
- Quiz-specific leaderboards
- Top 3 podium display
- Your current rank
- Filter by quiz

### 8. Profile (`/profile`)
- View and edit profile
- Stats overview
- Update name and email

### 9. AI Question Generator (`/ai`)
- Enter topic or subject
- Select category and difficulty
- Choose number of questions
- Generate questions with AI
- Preview generated questions
- Save as new quiz

---

## 🔐 Admin Features

### Admin Dashboard (`/admin`)
- Platform statistics
- Category distribution chart
- Recent performance trend
- Recent activity feed

### Manage Quizzes (`/admin/manage`)
- View all quizzes
- Create new quiz with:
  - Title, description
  - Category, difficulty, duration
  - Cover emoji and gradient
  - Multiple questions
  - Options, correct answers
  - Marks and negative marks
  - Explanations
- Edit existing quizzes
- Delete quizzes
- Publish/unpublish quizzes

---

## 🎨 UI Features

### Theme Toggle
- Click sun/moon icon in navbar
- Switches between light and dark mode
- Persists preference

### Responsive Design
- Mobile-friendly navigation
- Hamburger menu on small screens
- Responsive grids and cards

### Animations
- Smooth transitions
- Hover effects
- Gradient animations
- Loading states

---

## 📊 Data Persistence

All data is stored in `localStorage`:
- User accounts
- Quizzes
- Quiz attempts
- Leaderboard entries

**To reset data:**
1. Open browser DevTools
2. Go to Application > Local Storage
3. Clear all keys starting with `quizverse_`
4. Refresh page

---

## 🧪 Test Scenarios

### Scenario 1: Student takes a quiz
1. Login as student
2. Browse quizzes
3. Click "JavaScript Fundamentals"
4. Answer questions
5. Submit quiz
6. View results
7. Download certificate

### Scenario 2: Admin creates a quiz
1. Login as admin
2. Go to "Manage Quizzes"
3. Click "Create Quiz"
4. Fill in quiz details
5. Add questions
6. Save quiz
7. Publish quiz

### Scenario 3: AI generates questions
1. Login as any user
2. Go to "AI Generator"
3. Enter topic: "React Hooks"
4. Select category: Programming
5. Click "Generate with AI"
6. Review generated questions
7. Save as quiz

### Scenario 4: Check leaderboard
1. Take multiple quizzes
2. Go to Leaderboard
3. Switch between global and quiz-specific
4. See your rank

---

## 🐛 Troubleshooting

### Data not showing?
- Check browser console for errors
- Clear localStorage and refresh
- Ensure you're logged in

### Can't login?
- Use exact demo credentials
- Check email/password spelling
- Try registering a new account

### Build errors?
- Run `npm install`
- Clear `node_modules` and reinstall
- Check Node.js version (18+)

---

## 📱 Mobile Testing

1. Open DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device
4. Test all features

---

## 🎯 Key Files to Explore

- `src/App.tsx` - Main app with routing
- `src/contexts/AuthContext.tsx` - Authentication logic
- `src/data/seedQuizzes.ts` - Sample quiz data
- `src/pages/QuizAttempt.tsx` - Quiz taking logic
- `src/pages/Result.tsx` - Results and certificate

---

## 🚀 Next Steps

1. Explore all features
2. Try creating your own quiz (as admin)
3. Take quizzes and check analytics
4. View leaderboard
5. Generate AI questions
6. Switch between light/dark themes

---

**Enjoy exploring QuizVerse! 🎉**

For backend implementation details, see:
- [SCHEMA.md](./SCHEMA.md) - Database schema
- [API.md](./API.md) - API documentation
