# FitnessBuddy Local Backend - Visual Setup Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Computer                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────┐          ┌──────────────────────┐  │
│  │  Frontend           │          │  Backend             │  │
│  │  (React + Vite)     │          │  (Express.js)        │  │
│  │                     │          │                      │  │
│  │ Port: 5173          │◄────────►│ Port: 5000           │  │
│  │ http://localhost    │  HTTP    │ http://localhost     │  │
│  │        :5173        │  Fetch   │      :5000/api       │  │
│  │                     │          │                      │  │
│  └─────────────────────┘          └──────────────────────┘  │
│                                              ▲               │
│                                              │               │
│                                              ▼               │
│                                    ┌──────────────────┐     │
│                                    │   Mock Data      │     │
│                                    │   (In-Memory)    │     │
│                                    └──────────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
FitnessBuddy-FrontEnd/
├── src/
│   ├── lib/
│   │   ├── api.js           ← NEW: API service layer
│   │   └── supabase.js      (existing)
│   ├── components/
│   ├── pages/
│   └── ...
├── .env                     ← MODIFIED: Added VITE_API_BASE_URL
├── server.js                ← NEW: Express backend
├── BACKEND_SETUP.md         ← NEW: Setup guide
├── IMPLEMENTATION_SUMMARY.md ← NEW: This summary
├── API_EXAMPLES.jsx         ← NEW: Component examples
├── backend-package.json     ← NEW: Backend dependencies
├── start-backend.bat        ← NEW: Windows startup
└── ...
```

## Step-by-Step Setup

### 1️⃣ Create Backend Directory
```
C:\projects\
└── fitness-buddy-backend/   ← Create this
```

### 2️⃣ Copy Files
```
fitness-buddy-backend/
├── server.js                ← Copy from frontend root
├── package.json             ← Copy backend-package.json and rename
└── node_modules/            ← Will be created by npm
```

### 3️⃣ Install Dependencies
```
cd fitness-buddy-backend
npm install
```

### 4️⃣ Start Server
```
node server.js
```

### 5️⃣ Check Health
```
Browser: http://localhost:5000/api/health
Expected: { status: 'OK', message: '...' }
```

## API Request Flow

```
React Component
      ↓
api.js (ProfileAPI.getAll())
      ↓
fetch('http://localhost:5000/api/profiles')
      ↓
Express Server
      ↓
Route Handler
      ↓
Mock Data (mockData.profiles)
      ↓
JSON Response
      ↓
React Component State
      ↓
UI Update
```

## Example Request

### Code
```javascript
import { ProfileAPI } from '../lib/api'

// Make request
const profiles = await ProfileAPI.getAll()
```

### Behind the Scenes
```
1. ProfileAPI.getAll() called
2. apiGet('/profiles') invoked
3. fetch('http://localhost:5000/api/profiles', {
     method: 'GET',
     headers: { 'Content-Type': 'application/json' }
   })
4. Server receives request at GET /api/profiles
5. Returns mockData.profiles as JSON
6. Response returned to component
7. profiles state updated
8. Component re-renders
```

## API Endpoints Reference

### Available Resources

```
╔═════════════════════════════════════════════════════════════╗
║                  PROFILES ENDPOINTS                        ║
╠═════════════════════════════════════════════════════════════╣
║ GET    /profiles          - List all                        ║
║ GET    /profiles/:id      - Get one                         ║
║ POST   /profiles          - Create                          ║
║ PUT    /profiles/:id      - Update                          ║
║ DELETE /profiles/:id      - Delete                          ║
╚═════════════════════════════════════════════════════════════╝

╔═════════════════════════════════════════════════════════════╗
║                  WORKOUTS ENDPOINTS                        ║
╠═════════════════════════════════════════════════════════════╣
║ GET    /workouts/user/:userId  - User's workouts          ║
║ POST   /workouts               - Create                     ║
║ PUT    /workouts/:id           - Update                     ║
║ DELETE /workouts/:id           - Delete                     ║
╚═════════════════════════════════════════════════════════════╝

[Same pattern for: Buddies, Goals, Achievements, Challenges]
```

## Running Both Frontend & Backend

### Terminal 1 - Backend
```bash
cd fitness-buddy-backend
node server.js

# Output:
# 🚀 FitnessBuddy Backend Server running at http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd FitnessBuddy-FrontEnd
npm run dev

# Output:
# ➜  Local:   http://localhost:5173/
```

### Verify Both Running
```
Backend:  http://localhost:5000/api/health
Frontend: http://localhost:5173/
```

## Testing the API

### Method 1: Browser
```
Open: http://localhost:5000/api/profiles
See: All profiles in JSON format
```

### Method 2: Frontend Component
```javascript
// In any component
import { ProfileAPI } from '../lib/api'

useEffect(() => {
  ProfileAPI.getAll()
    .then(data => console.log(data))
    .catch(err => console.error(err))
}, [])
```

### Method 3: Network Tab
```
1. Open DevTools (F12)
2. Click Network tab
3. Make API call in component
4. See request/response
```

## Environment Variables

### Frontend (.env)
```dotenv
# Backend URL (required)
VITE_API_BASE_URL=http://localhost:5000/api

# Supabase (existing)
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...
```

### Backend (server.js)
```javascript
const PORT = process.env.PORT || 5000
```

## Common Tasks

### Create New Profile
```javascript
ProfileAPI.create({
  email: 'user@example.com',
  username: 'john_doe',
  age: 28,
  location: 'New York'
})
```

### Update Profile
```javascript
ProfileAPI.update('userId', {
  age: 29,
  location: 'Boston'
})
```

### Delete Profile
```javascript
ProfileAPI.delete('userId')
```

### Get User's Workouts
```javascript
WorkoutAPI.getUserWorkouts('userId')
```

### Create Workout
```javascript
WorkoutAPI.create({
  user_id: 'userId',
  type: 'Running',
  duration: 30,
  distance: 5,
  calories: 300
})
```

## Switching Between Backends

### Development (Local)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Production (Remote)
```env
VITE_API_BASE_URL=https://api.example.com/api
```

### Fallback (Supabase)
```env
# Remove VITE_API_BASE_URL - app uses Supabase
```

## Troubleshooting Checklist

```
❓ Port 5000 already in use?
  → Kill process or use different port

❓ CORS errors in console?
  → Check VITE_API_BASE_URL in .env
  → Verify backend is running

❓ 404 errors on API calls?
  → Check endpoint paths
  → Verify server is running
  → Look at server console

❓ Data not saved?
  → Current backend uses in-memory storage
  → Data resets when server restarts
  → Use real database for production

❓ Can't connect to localhost:5000?
  → Verify server is running
  → Check firewall settings
  → Try http://127.0.0.1:5000
```

## Performance Tips

1. **Use Backend for Development**
   - Faster than Supabase for local testing
   - No network latency
   - Easier debugging

2. **Mock Complex Responses**
   - Pre-populate mockData with test data
   - Test edge cases easily

3. **Monitor Console**
   - Check server logs for errors
   - Use browser DevTools
   - Enable verbose logging

## Next Steps

1. ✅ Setup backend directory
2. ✅ Install dependencies  
3. ✅ Start server
4. ✅ Verify health endpoint
5. ✅ Start frontend
6. ✅ Test API calls
7. ⏭️ **Replace mock data with real database**
8. ⏭️ **Add authentication**
9. ⏭️ **Deploy to production**

---

**Ready?** Jump to [BACKEND_SETUP.md](BACKEND_SETUP.md) for detailed instructions!
