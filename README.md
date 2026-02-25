# Fitness Buddy - Frontend

A modern, feature-rich fitness social platform built with React 18, Vite, and Tailwind CSS. Connect with fitness enthusiasts, track workouts, join challenges, and achieve your health goals together.

## 🌟 Features

### Core Features
- **User Authentication**: Sign up, login, and password recovery via Supabase Auth
- **Profile Management**: Create and customize your fitness profile with avatar upload
- **Workout Tracking**: Log workouts with duration, distance, and calorie calculations
- **Goal Management**: Set and track personal fitness goals with progress visualization
- **Challenges**: Join community challenges, track progress, and earn badges
- **Leaderboard**: Compete with other users individually or in groups
- **Buddy System**: Find and connect with fitness partners based on compatibility matching
- **Real-time Chat**: Instant messaging with connected fitness buddies
- **Gym Finder**: Discover nearby fitness venues with details and save favorites
- **Achievements**: Earn badges for milestones and accomplishments

### UI/UX Features
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Mode Support**: Toggle between light and dark themes
- **Smooth Animations**: Spring-based animations using Framer Motion
- **Interactive Backgrounds**: Particle effects and gradient animations
- **Page Transitions**: Smooth navigation between pages with animations
- **Collapsible Sidebar**: Easy navigation with active link highlighting
- **Real-time Notifications**: Alerts for group joins, connections, and messages

## 🛠️ Tech Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.2.0
- **Styling**: Tailwind CSS 3.4.1 with custom colors
- **Animations**: Framer Motion 10.16.4
- **State Management**: React Context API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with JWT tokens
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts for progress visualization
- **Effects**: React Confetti for celebrations
- **Routing**: React Router DOM v6


## 🚀 Installation

1. **Clone the repository**
   ```bash
   cd FrontEnd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local` file** with Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5173`


## 🚢 Deployment

Frontend: https://fitnesbudy.netlify.app/

Backend API: https://fitnessbuddy-backend.onrender.com

## 📊 Pages Overview

### Dashboard
- Quick action buttons to navigate key features
- Fitness statistics summary
- Recent workouts preview
- Call-to-action for profile completion

### Profile
- Edit personal information (age, location, goal, etc.)
- Avatar upload to Supabase Storage
- Profile completion status
- Success/error notifications

### Goals
- Create new fitness goals
- Track progress toward targets
- Visual progress bars
- Goal history and completion

### Workouts
- Log new workouts with type, duration, distance
- Auto-calculate calories burned
- View workout history
- Weekly summary statistics
- Celebrate weekly goal achievements

### Buddies
- View recommended fitness buddies with match scores
- Connect with other users
- View all connected buddies
- Start conversations with buddies
- Profile information and preferences

### Challenges
- Browse available challenges
- Join challenges to compete
- Track personal progress
- Earn reward badges
- Challenge creation (for users)

### GymFinder
- Search and filter gyms by type
- View gym details (address, phone, hours, amenities)
- Get directions via Google Maps
- Save favorite gyms
- Unsave gyms from favorites

### Leaderboard
- Individual rankings by points
- Group leaderboards
- Join fitness groups with alerts
- Track personal rank and stats compared to others

### Chat
- See all connected buddies list
- Send/receive real-time messages
- Message history with timestamps
- Responsive chat interface

### Achievements
- View earned badges and milestones
- Celebrate accomplishments
- Track achievement progress

## 📱 Responsive Design

- **Mobile (< 768px)**: Single column, collapsible sidebar
- **Tablet (768px - 1024px)**: Two columns, visible sidebar toggle
- **Desktop (> 1024px)**: Three columns, expanded sidebar, full layout


## 🔗 Links

**Live Demo**: 
https://youtu.be/q6NQj6cFDNY

**Git Repositories**:
- FrontEnd: https://github.com/deepthiallamudi-ux/FitnessBuddy-FrontEnd.git
- Backend: https://github.com/deepthiallamudi-ux/FitnessBuddy-Backend.git

## 👤 Support

For issues and questions:
1. Check existing issues on GitHub
2. Create detailed bug reports with screenshots
3. Include browser/device information
4. Provide steps to reproduce

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Supabase Docs](https://supabase.com/docs)
- [React Router](https://reactrouter.com)
