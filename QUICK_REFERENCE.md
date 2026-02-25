# Quick Reference Card

## 🚀 Quick Start (2 minutes)

```bash
# Terminal 1: Backend
mkdir fitness-buddy-backend && cd fitness-buddy-backend
npm init -y
npm install express cors
# Copy server.js here
node server.js

# Terminal 2: Frontend
cd FitnessBuddy-FrontEnd
npm run dev
```

## ✅ Verify Setup

```
✓ Backend running:   http://localhost:5000/api/health
✓ Frontend running:  http://localhost:5173
```

## 📝 API Quick Reference

### Import
```javascript
import { ProfileAPI, WorkoutAPI, BuddyAPI } from '../lib/api'
```

### Profile Methods
| Method | Usage |
|--------|-------|
| `getAll()` | Get all profiles |
| `getById(id)` | Get profile by ID |
| `create(data)` | Create new profile |
| `update(id, data)` | Update profile |
| `delete(id)` | Delete profile |

### Workout Methods
| Method | Usage |
|--------|-------|
| `getUserWorkouts(userId)` | Get user's workouts |
| `getById(id)` | Get workout details |
| `create(data)` | Create workout |
| `update(id, data)` | Update workout |
| `delete(id)` | Delete workout |

### Same Pattern For
- `BuddyAPI`
- `GoalAPI`
- `AchievementAPI`
- `ChallengeAPI`

## 🧪 Testing Examples

### Get All Profiles
```javascript
const profiles = await ProfileAPI.getAll()
console.log(profiles)
```

### Create Workout
```javascript
const workout = await WorkoutAPI.create({
  user_id: 'user123',
  type: 'Running',
  duration: 30,
  calories: 300
})
```

### Update Profile
```javascript
const updated = await ProfileAPI.update('userId', {
  age: 29,
  location: 'Boston'
})
```

### Delete Profile
```javascript
await ProfileAPI.delete('userId')
```

## 📂 File Locations

| File | Purpose |
|------|---------|
| `src/lib/api.js` | API service layer |
| `server.js` | Express backend |
| `.env` | Contains VITE_API_BASE_URL |
| `BACKEND_SETUP.md` | Full setup guide |
| `API_EXAMPLES.jsx` | React examples |
| `VISUAL_GUIDE.md` | Architecture diagrams |

## 🔧 Common Commands

```bash
# Start backend
node server.js

# Start frontend
npm run dev

# Install backend deps
npm install express cors

# Check if port is in use
netstat -ano | findstr :5000

# Kill process on port 5000
taskkill /PID <PID> /F
```

## 🎯 All API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Profiles
```
GET    /profiles
GET    /profiles/:id
POST   /profiles
PUT    /profiles/:id
DELETE /profiles/:id
```

### Workouts
```
GET    /workouts/user/:userId
GET    /workouts/:id
POST   /workouts
PUT    /workouts/:id
DELETE /workouts/:id
```

### Buddies
```
GET    /buddies/user/:userId
GET    /buddies/pending/:userId
GET    /buddies/:id
POST   /buddies
PUT    /buddies/:id
DELETE /buddies/:id
```

### Goals, Achievements, Challenges
```
Same pattern as workouts
/goals, /achievements, /challenges
```

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change port or kill process |
| CORS error | Check VITE_API_BASE_URL |
| 404 error | Verify server running |
| No data saved | Use real database |
| Frontend can't connect | Check backend URL |

## 💾 Environment Setup

### .env
```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...
```

## 📊 Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 5000 | http://localhost:5000 |
| API | 5000 | http://localhost:5000/api |

## 🚢 Production Setup

```env
# For production, update to:
VITE_API_BASE_URL=https://your-api.com/api
```

Deploy backend to:
- Heroku
- AWS
- Railway
- DigitalOcean
- Render

## 📚 Documentation Files

1. **BACKEND_SETUP.md** - Complete setup guide
2. **VISUAL_GUIDE.md** - Architecture & diagrams  
3. **IMPLEMENTATION_SUMMARY.md** - What was built
4. **API_EXAMPLES.jsx** - React component examples
5. **This file** - Quick reference

## ⚡ Pro Tips

```javascript
// Always use try-catch
try {
  const data = await ProfileAPI.getAll()
} catch (error) {
  console.error('Failed:', error.message)
}

// In React components
useEffect(() => {
  ProfileAPI.getAll()
    .then(setProfiles)
    .catch(console.error)
}, [])

// For error handling
if (error) return <div>Error: {error}</div>
if (loading) return <div>Loading...</div>
```

## ✨ Next Steps

1. Start backend: `node server.js`
2. Start frontend: `npm run dev`
3. Test API: Open http://localhost:5000/api/profiles
4. Try examples: See API_EXAMPLES.jsx
5. Integrate with components: Use in React code
6. Add database: Replace mock data

---

**Everything is ready! Start the backend and enjoy building! 🎉**
