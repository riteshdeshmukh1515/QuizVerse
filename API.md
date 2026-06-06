# API Documentation

Complete REST API reference for QuizVerse backend.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-api-domain.com/api
```

## Authentication

All protected routes require JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c8b1f8e4c1a1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Errors:**
- `400` - Email already exists
- `400` - Invalid input data

---

### 2. Login

**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c8b1f8e4c1a1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "avatarColor": "from-indigo-500 to-purple-600"
  }
}
```

**Errors:**
- `401` - Invalid credentials

---

### 3. Forgot Password

**POST** `/auth/forgot-password`

Send password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 4. Reset Password

**POST** `/auth/reset-password`

Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 5. Get Current User

**GET** `/auth/me`

Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "60d5ec49f1b2c8b1f8e4c1a1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "avatarColor": "from-indigo-500 to-purple-600",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Quiz Endpoints

### 1. Get All Quizzes

**GET** `/quizzes`

Get all published quizzes with optional filters.

**Query Parameters:**
- `category` (optional) - Filter by category
- `difficulty` (optional) - Filter by difficulty
- `search` (optional) - Search in title/description/tags
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "quizzes": [
    {
      "id": "60d5ec49f1b2c8b1f8e4c1a1",
      "title": "JavaScript Basics",
      "description": "Learn JavaScript fundamentals",
      "category": "Programming",
      "difficulty": "Easy",
      "durationMinutes": 10,
      "questionsCount": 10,
      "coverEmoji": "⚡",
      "coverGradient": "from-indigo-500 via-purple-500 to-pink-500",
      "tags": ["javascript", "web"],
      "createdAt": "2024-01-10T08:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

---

### 2. Get Quiz by ID

**GET** `/quizzes/:id`

Get complete quiz with questions.

**Response (200 OK):**
```json
{
  "success": true,
  "quiz": {
    "id": "60d5ec49f1b2c8b1f8e4c1a1",
    "title": "JavaScript Basics",
    "description": "Learn JavaScript fundamentals",
    "category": "Programming",
    "difficulty": "Easy",
    "durationMinutes": 10,
    "coverEmoji": "⚡",
    "coverGradient": "from-indigo-500 via-purple-500 to-pink-500",
    "tags": ["javascript", "web"],
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "question": "What is JavaScript?",
        "options": ["Language", "Framework", "Library", "Database"],
        "marks": 5,
        "negativeMarks": 1
      }
    ],
    "createdAt": "2024-01-10T08:00:00Z"
  }
}
```

**Note:** Correct answers are NOT returned in this endpoint.

---

### 3. Create Quiz (Admin)

**POST** `/quizzes`

Create a new quiz (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Python Advanced",
  "description": "Advanced Python concepts",
  "category": "Programming",
  "difficulty": "Hard",
  "durationMinutes": 30,
  "tags": ["python", "advanced"],
  "coverEmoji": "🐍",
  "coverGradient": "from-green-500 to-emerald-600",
  "questions": [
    {
      "type": "mcq",
      "question": "What is a decorator?",
      "options": ["Function modifier", "Class", "Variable", "Module"],
      "correctAnswer": "Function modifier",
      "marks": 5,
      "negativeMarks": 1,
      "explanation": "Decorators modify function behavior"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Quiz created successfully",
  "quiz": {
    "id": "60d5ec49f1b2c8b1f8e4c1a2",
    "title": "Python Advanced",
    "published": false
  }
}
```

---

### 4. Update Quiz (Admin)

**PUT** `/quizzes/:id`

Update quiz details (admin only).

**Request Body:** (same as create, partial updates allowed)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Quiz updated successfully"
}
```

---

### 5. Delete Quiz (Admin)

**DELETE** `/quizzes/:id`

Delete quiz and all associated attempts (admin only).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Quiz deleted successfully"
}
```

---

### 6. Publish/Unpublish Quiz (Admin)

**PATCH** `/quizzes/:id/publish`

Toggle quiz publish status.

**Request Body:**
```json
{
  "published": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Quiz published successfully"
}
```

---

## Quiz Attempt Endpoints

### 1. Submit Quiz Attempt

**POST** `/attempts`

Submit completed quiz attempt.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quizId": "60d5ec49f1b2c8b1f8e4c1a1",
  "startedAt": "2024-01-15T10:00:00Z",
  "submittedAt": "2024-01-15T10:10:00Z",
  "durationSeconds": 600,
  "answers": [
    {
      "questionId": "q1",
      "selected": "Language",
      "isCorrect": true,
      "marksAwarded": 5
    },
    {
      "questionId": "q2",
      "selected": null,
      "isCorrect": false,
      "marksAwarded": 0
    }
  ],
  "totalMarks": 50,
  "score": 45,
  "percentage": 90,
  "status": "submitted"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "attempt": {
    "id": "60d5ec49f1b2c8b1f8e4c1a3",
    "quizId": "60d5ec49f1b2c8b1f8e4c1a1",
    "score": 45,
    "percentage": 90,
    "status": "submitted"
  }
}
```

---

### 2. Get Attempt Details

**GET** `/attempts/:id`

Get detailed attempt with correct answers.

**Response (200 OK):**
```json
{
  "success": true,
  "attempt": {
    "id": "60d5ec49f1b2c8b1f8e4c1a3",
    "quizId": "60d5ec49f1b2c8b1f8e4c1a1",
    "userId": "60d5ec49f1b2c8b1f8e4c1a1",
    "startedAt": "2024-01-15T10:00:00Z",
    "submittedAt": "2024-01-15T10:10:00Z",
    "durationSeconds": 600,
    "totalMarks": 50,
    "score": 45,
    "percentage": 90,
    "status": "submitted",
    "answers": [
      {
        "questionId": "q1",
        "selected": "Language",
        "correctAnswer": "Language",
        "isCorrect": true,
        "marksAwarded": 5,
        "explanation": "JavaScript is a programming language"
      }
    ],
    "quiz": {
      "title": "JavaScript Basics",
      "category": "Programming"
    }
  }
}
```

---

### 3. Get User's Attempts

**GET** `/attempts/user`

Get all attempts by authenticated user.

**Query Parameters:**
- `page` (optional) - Page number
- `limit` (optional) - Items per page

**Response (200 OK):**
```json
{
  "success": true,
  "attempts": [
    {
      "id": "60d5ec49f1b2c8b1f8e4c1a3",
      "quizId": "60d5ec49f1b2c8b1f8e4c1a1",
      "quizTitle": "JavaScript Basics",
      "score": 45,
      "percentage": 90,
      "submittedAt": "2024-01-15T10:10:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15
  }
}
```

---

## Leaderboard Endpoints

### 1. Get Global Leaderboard

**GET** `/leaderboard/global`

Get global leaderboard (top users by total score).

**Query Parameters:**
- `limit` (optional) - Number of entries (default: 50)

**Response (200 OK):**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "userId": "60d5ec49f1b2c8b1f8e4c1a1",
      "name": "John Doe",
      "avatarColor": "from-indigo-500 to-purple-600",
      "totalScore": 450,
      "totalQuizzes": 10,
      "avgPercentage": 90
    }
  ]
}
```

---

### 2. Get Quiz Leaderboard

**GET** `/leaderboard/quiz/:quizId`

Get leaderboard for specific quiz.

**Response (200 OK):**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "userId": "60d5ec49f1b2c8b1f8e4c1a1",
      "name": "John Doe",
      "avatarColor": "from-indigo-500 to-purple-600",
      "score": 50,
      "percentage": 100,
      "durationSeconds": 480,
      "date": "2024-01-15T10:10:00Z"
    }
  ]
}
```

---

### 3. Get User's Rank

**GET** `/leaderboard/rank`

Get authenticated user's rank.

**Query Parameters:**
- `quizId` (optional) - Get rank for specific quiz

**Response (200 OK):**
```json
{
  "success": true,
  "rank": 5,
  "totalParticipants": 100,
  "type": "global"
}
```

---

## User Endpoints

### 1. Update Profile

**PUT** `/users/profile`

Update user profile.

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

### 2. Change Password

**PUT** `/users/password`

Change user password.

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Admin Endpoints

### 1. Get All Users

**GET** `/admin/users`

Get all users (admin only).

**Query Parameters:**
- `role` (optional) - Filter by role
- `page` (optional) - Page number
- `limit` (optional) - Items per page

**Response (200 OK):**
```json
{
  "success": true,
  "users": [
    {
      "id": "60d5ec49f1b2c8b1f8e4c1a1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "createdAt": "2024-01-15T10:30:00Z",
      "totalAttempts": 15,
      "avgScore": 85
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

---

### 2. Get Analytics

**GET** `/admin/analytics`

Get platform analytics (admin only).

**Response (200 OK):**
```json
{
  "success": true,
  "analytics": {
    "totalUsers": 1000,
    "totalQuizzes": 50,
    "totalAttempts": 5000,
    "avgScore": 75.5,
    "categoryDistribution": [
      { "category": "Programming", "count": 20 },
      { "category": "Mathematics", "count": 15 }
    ],
    "recentActivity": [
      {
        "userId": "60d5ec49f1b2c8b1f8e4c1a1",
        "userName": "John Doe",
        "quizTitle": "JavaScript Basics",
        "score": 90,
        "date": "2024-01-15T10:10:00Z"
      }
    ]
  }
}
```

---

### 3. Export Results

**GET** `/admin/export/:quizId`

Export quiz results to CSV (admin only).

**Response:** CSV file download

---

## AI Endpoints

### 1. Generate Questions

**POST** `/ai/generate`

Generate quiz questions using AI.

**Request Body:**
```json
{
  "topic": "JavaScript closures",
  "category": "Programming",
  "difficulty": "Medium",
  "numQuestions": 5
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "questions": [
    {
      "type": "mcq",
      "question": "What is a closure in JavaScript?",
      "options": [
        "A function with access to outer scope",
        "A loop construct",
        "A data type",
        "An error handler"
      ],
      "correctAnswer": "A function with access to outer scope",
      "explanation": "Closures allow functions to access variables from their outer scope"
    }
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

API requests are rate limited:
- **Authentication endpoints**: 5 requests per minute
- **Quiz endpoints**: 100 requests per minute
- **AI endpoints**: 10 requests per minute

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

---

## WebSocket (Future)

Real-time features (planned):
- Live quiz notifications
- Real-time leaderboard updates
- Multiplayer quiz mode

---

**For more details, see the backend implementation in the `/server` directory (not included in this frontend demo).**
