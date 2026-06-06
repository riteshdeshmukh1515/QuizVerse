# Database Schema

This document outlines the database schema for QuizVerse. The schema is designed for MongoDB but can be adapted for SQL databases.

## Collections

### 1. Users Collection

Stores user account information and authentication data.

```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;              // unique, indexed
  password: string;           // bcrypt hashed
  role: "student" | "admin";  // default: "student"
  avatarColor: string;        // gradient class for avatar
  createdAt: Date;            // default: Date.now()
  updatedAt: Date;
  
  // Optional fields
  profileImage?: string;      // URL to avatar image
  bio?: string;
  preferences?: {
    theme: "light" | "dark";
    emailNotifications: boolean;
  };
}
```

**Indexes:**
- `email`: unique
- `role`: for admin queries
- `createdAt`: for sorting

---

### 2. Quizzes Collection

Stores quiz metadata and configuration.

```typescript
interface Quiz {
  _id: ObjectId;
  title: string;
  description: string;
  category: "Programming" | "Aptitude" | "Mathematics" | "Science" | "General Knowledge";
  difficulty: "Easy" | "Medium" | "Hard";
  durationMinutes: number;
  createdBy: ObjectId;        // ref: User
  createdAt: Date;
  updatedAt: Date;
  published: boolean;         // default: false
  tags: string[];             // for search and filtering
  coverEmoji: string;         // emoji for quiz card
  coverGradient: string;      // gradient class
  questions: Question[];      // embedded array
}
```

**Indexes:**
- `category`: for filtering
- `difficulty`: for filtering
- `published`: for active quizzes
- `createdBy`: for admin's quizzes
- `tags`: text index for search
- Compound: `{ published: 1, createdAt: -1 }`

---

### 3. Questions (Embedded in Quiz)

Questions are embedded in the Quiz document for better read performance.

```typescript
interface Question {
  _id: ObjectId;
  type: "mcq" | "tf" | "fill";
  question: string;
  options?: string[];         // for mcq and tf
  correctAnswer: string;
  marks: number;              // default: 5
  negativeMarks: number;      // default: 1
  explanation?: string;
  aiGenerated?: boolean;      // true if created by AI
}
```

---

### 4. Quiz Attempts Collection

Records every quiz attempt by users.

```typescript
interface QuizAttempt {
  _id: ObjectId;
  quizId: ObjectId;           // ref: Quiz
  userId: ObjectId;           // ref: User
  startedAt: Date;
  submittedAt: Date;
  durationSeconds: number;    // actual time taken
  answers: AttemptAnswer[];
  totalMarks: number;
  score: number;              // marks obtained
  percentage: number;         // (score / totalMarks) * 100
  status: "submitted" | "timed-out";
  createdAt: Date;            // default: Date.now()
}
```

**Indexes:**
- `userId`: for user's attempts
- `quizId`: for quiz analytics
- `submittedAt`: for sorting
- Compound: `{ userId: 1, submittedAt: -1 }`

---

### 5. Attempt Answers (Embedded in QuizAttempt)

```typescript
interface AttemptAnswer {
  questionId: ObjectId;       // ref: Question._id
  selected: string | null;    // null if skipped
  isCorrect: boolean;
  marksAwarded: number;       // can be negative
}
```

---

### 6. Leaderboard Collection

Materialized view for fast leaderboard queries.

```typescript
interface LeaderboardEntry {
  _id: ObjectId;
  userId: ObjectId;           // ref: User
  quizId: ObjectId;           // ref: Quiz (null for global)
  score: number;              // for quiz-specific
  percentage: number;
  durationSeconds: number;
  date: Date;
  
  // For global leaderboard (aggregated)
  isGlobal?: boolean;
  totalScore?: number;        // sum of all quiz scores
  totalQuizzes?: number;
  avgPercentage?: number;
}
```

**Indexes:**
- `quizId`: for quiz-specific leaderboard
- `isGlobal`: for global leaderboard
- Compound: `{ quizId: 1, percentage: -1 }`
- Compound: `{ isGlobal: 1, totalScore: -1 }`

---

## Relationships

```
User (1) ←→ (N) QuizAttempt
Quiz (1) ←→ (N) QuizAttempt
User (1) ←→ (N) LeaderboardEntry
Quiz (1) ←→ (N) LeaderboardEntry
Quiz (1) ←→ (N) Question (embedded)
QuizAttempt (1) ←→ (N) AttemptAnswer (embedded)
```

---

## MongoDB Schema (Mongoose)

```javascript
// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  avatarColor: { type: String, default: 'from-indigo-500 to-purple-600' },
  profileImage: String,
  bio: String,
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    emailNotifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Quiz Schema
const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['mcq', 'tf', 'fill'], required: true },
  question: { type: String, required: true },
  options: [String],
  correctAnswer: { type: String, required: true },
  marks: { type: Number, default: 5 },
  negativeMarks: { type: Number, default: 1 },
  explanation: String,
  aiGenerated: { type: Boolean, default: false }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Programming', 'Aptitude', 'Mathematics', 'Science', 'General Knowledge'], required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  durationMinutes: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  published: { type: Boolean, default: false },
  tags: [String],
  coverEmoji: { type: String, default: '📚' },
  coverGradient: { type: String, default: 'from-indigo-500 via-purple-500 to-pink-500' },
  questions: [questionSchema]
}, { timestamps: true });

// Quiz Attempt Schema
const attemptAnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selected: String,
  isCorrect: { type: Boolean, required: true },
  marksAwarded: { type: Number, required: true }
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startedAt: { type: Date, required: true },
  submittedAt: { type: Date, required: true },
  durationSeconds: { type: Number, required: true },
  answers: [attemptAnswerSchema],
  totalMarks: { type: Number, required: true },
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  status: { type: String, enum: ['submitted', 'timed-out'], required: true }
}, { timestamps: true });

// Leaderboard Schema
const leaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  durationSeconds: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  isGlobal: { type: Boolean, default: false },
  totalScore: Number,
  totalQuizzes: Number,
  avgPercentage: Number
});
```

---

## SQL Alternative (PostgreSQL)

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  avatar_color VARCHAR(100),
  profile_image TEXT,
  bio TEXT,
  theme VARCHAR(10) DEFAULT 'light',
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes Table
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  created_by INTEGER REFERENCES users(id),
  published BOOLEAN DEFAULT false,
  cover_emoji VARCHAR(10) DEFAULT '📚',
  cover_gradient VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions Table
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  question TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  marks INTEGER DEFAULT 5,
  negative_marks INTEGER DEFAULT 1,
  explanation TEXT,
  ai_generated BOOLEAN DEFAULT false
);

-- Quiz Attempts Table
CREATE TABLE quiz_attempts (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES quizzes(id),
  user_id INTEGER REFERENCES users(id),
  started_at TIMESTAMP NOT NULL,
  submitted_at TIMESTAMP NOT NULL,
  duration_seconds INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  score INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attempt Answers Table
CREATE TABLE attempt_answers (
  id SERIAL PRIMARY KEY,
  attempt_id INTEGER REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id),
  selected TEXT,
  is_correct BOOLEAN NOT NULL,
  marks_awarded INTEGER NOT NULL
);

-- Leaderboard Table
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  quiz_id INTEGER REFERENCES quizzes(id),
  score INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  duration_seconds INTEGER NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_global BOOLEAN DEFAULT false,
  total_score INTEGER,
  total_quizzes INTEGER,
  avg_percentage DECIMAL(5,2)
);

-- Indexes
CREATE INDEX idx_quizzes_category ON quizzes(category);
CREATE INDEX idx_quizzes_published ON quizzes(published);
CREATE INDEX idx_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_leaderboard_quiz ON leaderboard(quiz_id, percentage DESC);
CREATE INDEX idx_leaderboard_global ON leaderboard(is_global, total_score DESC);
```

---

## Data Flow

### Quiz Creation
1. Admin creates quiz with questions
2. Quiz saved to `quizzes` collection with embedded `questions`
3. Quiz marked as `published: false` initially

### Quiz Attempt
1. Student starts quiz → create `quiz_attempts` document
2. Student answers questions → store in memory
3. Student submits → calculate scores
4. Save `attempt_answers` array
5. Update `quiz_attempts` with results
6. Update `leaderboard` collection

### Leaderboard Update
1. After quiz submission, insert/update leaderboard entry
2. For global leaderboard, aggregate all user attempts
3. Periodic job to recalculate global rankings

---

## Migration Strategy

For production:
1. Use MongoDB with Mongoose ODM
2. Implement proper indexing
3. Set up backup strategy
4. Consider sharding for large datasets
5. Use Redis for caching leaderboard data

---

**Note:** This schema is optimized for read-heavy workloads. Consider denormalization for frequently accessed data.
