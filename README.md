# 🎯 QuizVerse - AI Powered Online Quiz Platform

<div align="center">



**A Modern Full-Stack AI-Powered Online Quiz Platform**

Built with **React + TypeScript + Vite + Tailwind CSS + Supabase + OpenRouter AI**

🚀 Create • Attempt • Analyze • Compete • Learn

</div>

---

## 📖 Overview

QuizVerse is a feature-rich online quiz platform designed for students, educators, and organizations. It enables users to create, take, manage, and analyze quizzes while leveraging AI for automatic question generation.

The platform includes advanced analytics, leaderboards, certificates, role-based access control, and AI-powered quiz creation.

---

## ✨ Key Features

### 👨‍🎓 Student Features

* 📝 Browse quizzes across multiple categories
* ⏱️ Timer-based quiz system
* 📊 Performance analytics dashboard
* 📈 Progress tracking and score history
* 🏆 Global and quiz-specific leaderboards
* 📜 Downloadable PDF certificates
* 🤖 AI-generated quizzes
* 🎯 Multiple question formats
* 🌙 Dark & Light Theme Support
* 📱 Fully Responsive Design

---

### 👨‍💼 Admin Features

* 📊 Admin Analytics Dashboard
* 📝 Create, Edit & Delete Quizzes
* 👥 Manage Users
* 📈 View Attempts & Statistics
* 🔐 Role-Based Access Control
* 🚀 Publish/Unpublish Quizzes
* 📋 Monitor Platform Activity

---

## 🎯 Quiz Types Supported

### Multiple Choice Questions (MCQ)

```text
Which language is used for React?

A. Python
B. Java
C. JavaScript ✅
D. C++
```

### True / False

```text
React is a JavaScript Library.

✅ True
```

### Fill in the Blank

```text
React was developed by ______.

Answer: Facebook
```

---

## 🤖 AI Powered Quiz Generation

Generate complete quizzes instantly using OpenRouter AI.

Features include:

* Topic-based quiz generation
* Difficulty selection
* Custom question count
* Automatic answer generation
* Explanation generation
* Instant quiz creation

Example:

```text
Topic: React Hooks
Difficulty: Medium
Questions: 10
```

AI generates a complete quiz automatically.

---

# 🏗️ System Architecture

```text
 ┌─────────────────┐
 │     React UI    │
 └────────┬────────┘
          │
          ▼
 ┌─────────────────┐
 │ Context API     │
 │ State Manager   │
 └────────┬────────┘
          │
          ▼
 ┌─────────────────┐
 │ Supabase Auth   │
 └────────┬────────┘
          │
          ▼
 ┌─────────────────┐
 │ Supabase DB     │
 └────────┬────────┘
          │
          ▼
 ┌─────────────────┐
 │ OpenRouter AI   │
 └─────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS
* React Router DOM
* Recharts
* Lucide React

## Backend

* Supabase Authentication
* Supabase PostgreSQL Database
* Supabase Edge Functions

## AI

* OpenRouter API
* Meta Llama Models
* GPT Models
* DeepSeek Models

---

# 📂 Project Structure

```bash
quizverse/
│
├── public/
│
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   ├── data/
│   ├── lib/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
│
├── supabase/
│   ├── migrations/
│   └── functions/
│
├── .env.example
├── package.json
├── vite.config.ts
└── README.md
```

---

# 🚀 Quick Start

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/quizverse.git

cd quizverse
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Environment Variables

Create:

```bash
.env
```

Add:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_key

# OpenRouter
VITE_OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx
VITE_OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
```

---

## 4️⃣ Setup Supabase

### Create Project

1. Open Supabase Dashboard
2. Create New Project
3. Copy URL and Anon Key

### Run Database Migration

```sql
supabase/migrations/20260101000000_quizverse_schema.sql
```

Paste and execute inside SQL Editor.

---

## 5️⃣ Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```


---
📸 Web Interface Screenshots

🏠 Home / Landing Page

<img width="1601" height="877" alt="Screenshot 2026-06-06 114852" src="https://github.com/user-attachments/assets/18445b41-efca-4458-8d9b-9c8c3a705d70" />

🔐 Login Page

<img width="1492" height="825" alt="Screenshot 2026-06-06 125303" src="https://github.com/user-attachments/assets/63075473-d1b3-4f71-8e8f-886611da9103" />

📊 Student Dashboard
<img width="1351" height="876" alt="Screenshot 2026-06-06 114222" src="https://github.com/user-attachments/assets/8579a456-b614-4d4e-962d-820a9642114b" />

📚 Browse Quizzes Page

<img width="1721" height="880" alt="Screenshot 2026-06-06 114121" src="https://github.com/user-attachments/assets/02676531-0b22-48ba-bae1-a2ba32bb7c51" />

🧠 Quiz Attempt Interface

<img width="1427" height="877" alt="Screenshot 2026-06-06 114725" src="https://github.com/user-attachments/assets/ff3954df-b87c-4147-a3f8-7a7cfee9dae8" />

🏆 Leaderboard Page

<img width="1411" height="868" alt="Screenshot 2026-06-06 114307" src="https://github.com/user-attachments/assets/9a10844c-8c8a-40a3-b96a-83e417473d18" />

🛠️ Admin Dashboard

<img width="1578" height="875" alt="Screenshot 2026-06-06 114051" src="https://github.com/user-attachments/assets/524cc030-411d-4014-ae2a-9f60d973b7fc" />

---


# 📊 Dashboard Features

### Student Dashboard

* Total Quizzes Taken
* Average Score
* Best Score
* Accuracy Percentage
* Category Analytics
* Recent Attempts
* Progress Graphs

### Admin Dashboard

* Total Users
* Total Quizzes
* Total Attempts
* Platform Performance
* Activity Monitoring

---

# 🗄️ Database Schema

## profiles

```sql
id
name
email
role
created_at
```

---

## quizzes

```sql
id
title
description
category
difficulty
duration
questions
created_by
created_at
```

---

## quiz_attempts

```sql
id
user_id
quiz_id
score
percentage
submitted_at
```

---

## leaderboards

```sql
id
user_id
quiz_id
rank
score
```

---

# 🔐 Authentication & Security

### Features

* Secure Login
* User Registration
* Password Reset
* Protected Routes
* Role-Based Access Control
* Supabase Authentication

### Security Measures

✅ Row Level Security (RLS)

✅ Admin-only Operations

✅ Secure API Access

✅ Protected User Data

✅ Authentication Guards

---

# 🏆 Leaderboard System

Features:

* Global Ranking
* Quiz Ranking
* Top Scorers
* Dynamic Updates
* Podium UI

Ranking is based on:

```text
Highest Score
Fastest Completion Time
Attempt Count
```

---

# 📜 Certificate Generation

Certificates are generated automatically when:

```text
Score ≥ Passing Percentage
```

Includes:

* Student Name
* Quiz Name
* Score
* Date
* Certificate ID

Downloadable as PDF.

---

# 📈 Analytics Features

### Student Analytics

* Accuracy
* Weak Areas
* Strong Areas
* Score Trend
* Quiz History

### Admin Analytics

* User Growth
* Popular Categories
* Completion Rates
* Average Scores
* Engagement Metrics

---

# 🎨 UI/UX Features

### Modern Interface

* Gradient Design
* Glassmorphism Effects
* Interactive Cards
* Smooth Animations

### Theme Support

* 🌞 Light Mode
* 🌙 Dark Mode

### Responsive Layout

* Desktop
* Tablet
* Mobile

---



# 🔮 Future Enhancements

* Live Quiz Battles
* Multiplayer Mode
* AI Tutor Integration
* Video Explanations
* Mobile App
* Email Notifications
* Discussion Forums
* Gamification System

---

# 🤝 Contributing

Contributions are welcome.

Steps:

```bash
Fork Repository

Create Branch

Commit Changes

Push Branch

Create Pull Request
```

---

# 📄 License

MIT License

Free for personal and commercial use.

---

# 👨‍💻 Author

Developed with ❤️ by **Ritesh Deshmukh**

### Connect

⭐ Star this repository if you found it useful.

---

<div align="center">

## 🎓 Learn Better. Compete Smarter. Grow Faster.

### 🚀 Welcome to QuizVerse

</div>
