# Local Node.js Backend Setup Guide

This guide explains how to set up and run the FitnessBuddy backend server locally.

## Quick Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step 1: Create Backend Project Directory

```bash
# Navigate to your desired location
cd /path/to/your/projects

# Create backend directory
mkdir fitness-buddy-backend
cd fitness-buddy-backend
```

### Step 2: Initialize Node.js Project

```bash
npm init -y
```

### Step 3: Install Dependencies

```bash
npm install express cors
```

### Step 4: Copy Server File

Copy the `server.js` file from the frontend repo to your backend directory:

```bash
# If server.js is in the frontend root
cp /path/to/FitnessBuddy-FrontEnd/server.js ./server.js
```

### Step 5: Start the Backend Server

```bash
node server.js
```

You should see:
```
🚀 FitnessBuddy Backend Server running at http://localhost:5000
📝 API Base URL: http://localhost:5000/api
✅ Health Check: http://localhost:5000/api/health
```

### Step 6: Verify Server is Running

Open your browser and navigate to:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "FitnessBuddy Backend is running"
}
```

## Frontend Configuration

The frontend is already configured to use the local backend. Update your `.env` file:

```env
VITE_SUPABASE_URL=https://uiradpgawcuoxybsjjhw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Local Node.js Backend Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

## Using the API

### Available Endpoints

#### Profiles
- `GET /api/profiles` - Get all profiles
- `GET /api/profiles/:id` - Get profile by ID
- `GET /api/profiles/email/:email` - Get profile by email
- `GET /api/profiles/username/:username` - Get profile by username
- `POST /api/profiles` - Create new profile
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile

#### Workouts
- `GET /api/workouts/user/:userId` - Get user's workouts
- `GET /api/workouts/:id` - Get specific workout
- `POST /api/workouts` - Create workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

#### Buddies
- `GET /api/buddies/user/:userId` - Get user's buddy connections
- `GET /api/buddies/pending/:userId` - Get pending buddy requests
- `GET /api/buddies/:id` - Get specific buddy connection
- `POST /api/buddies` - Create buddy connection
- `PUT /api/buddies/:id` - Update buddy connection
- `DELETE /api/buddies/:id` - Delete buddy connection

#### Goals
- `GET /api/goals/user/:userId` - Get user's goals
- `GET /api/goals/:id` - Get specific goal
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

#### Achievements
- `GET /api/achievements/user/:userId` - Get user's achievements
- `GET /api/achievements/:id` - Get specific achievement
- `POST /api/achievements` - Create achievement
- `PUT /api/achievements/:id` - Update achievement
- `DELETE /api/achievements/:id` - Delete achievement

#### Challenges
- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/user/:userId` - Get user's challenges
- `GET /api/challenges/:id` - Get specific challenge
- `POST /api/challenges` - Create challenge
- `PUT /api/challenges/:id` - Update challenge
- `DELETE /api/challenges/:id` - Delete challenge

## Using API in Frontend Code

### Example Usage with ProfileAPI

```javascript
import { ProfileAPI } from '../lib/api'

// Get all profiles
const profiles = await ProfileAPI.getAll()

// Get profile by ID
const profile = await ProfileAPI.getById('123')

// Create profile
const newProfile = await ProfileAPI.create({
  email: 'user@example.com',
  username: 'john_doe',
  age: 28,
  location: 'New York'
})

// Update profile
const updated = await ProfileAPI.update('123', {
  username: 'john_updated'
})

// Delete profile
await ProfileAPI.delete('123')
```

### Example Usage with WorkoutAPI

```javascript
import { WorkoutAPI } from '../lib/api'

// Get user's workouts
const workouts = await WorkoutAPI.getUserWorkouts('userId')

// Create workout
const workout = await WorkoutAPI.create({
  user_id: 'userId',
  type: 'Running',
  duration: 30,
  distance: 5,
  calories: 300
})

// Update workout
const updated = await WorkoutAPI.update('workoutId', {
  duration: 45
})
```

## Switching Between Supabase and Local Backend

### Use Local Backend (Development)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Use Supabase (Production)
```env
# Remove or comment out VITE_API_BASE_URL
# The app will fall back to Supabase
```

## Development Mode - Run Both Frontend and Backend

### Terminal 1 (Backend)
```bash
cd fitness-buddy-backend
node server.js
```

### Terminal 2 (Frontend)
```bash
cd FitnessBuddy-FrontEnd
npm run dev
```

Now your frontend will be at `http://localhost:5173` and backend at `http://localhost:5000`

## Production Deployment

When deploying to production:

1. Set your backend URL in `.env`:
```env
VITE_API_BASE_URL=https://your-production-backend.com/api
```

2. Deploy backend to a server (Heroku, AWS, Railway, etc.)

3. Update CORS settings in `server.js` if needed:
```javascript
app.use(cors({
  origin: 'https://your-production-frontend.com'
}))
```

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Try: `node server.js` on a different port by setting `PORT` env variable

### CORS errors
- Ensure CORS is enabled in backend (it is by default)
- Check frontend `.env` has correct `VITE_API_BASE_URL`

### API calls returning 404
- Verify server is running at correct URL
- Check endpoint path matches API documentation

### Data not persisting
- Current implementation uses in-memory storage
- Data resets when server restarts
- For production, integrate a real database (MongoDB, PostgreSQL, etc.)

## Next Steps

1. **Database Integration**: Connect to MongoDB or PostgreSQL
2. **Authentication**: Implement JWT tokens
3. **Validation**: Add request validation middleware
4. **Error Handling**: Improve error messages
5. **Logging**: Add request logging
6. **Testing**: Write unit and integration tests

## References

- [Express.js Documentation](https://expressjs.com/)
- [CORS Middleware](https://github.com/expressjs/cors)
- [Node.js Official Site](https://nodejs.org/)
