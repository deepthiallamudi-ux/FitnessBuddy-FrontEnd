/**
 * FitnessBuddy Local Backend Server
 * 
 * To run this server:
 * 1. Create a new Node.js project directory: mkdir fitness-buddy-backend
 * 2. Copy this file into that directory
 * 3. Run: npm install express cors
 * 4. Run: node server.js
 * 
 * The server will start at http://localhost:5000
 */

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Mock data storage (in production, use a real database)
const mockData = {
  profiles: [
    {
      id: '1',
      email: 'user1@example.com',
      username: 'john_doe',
      age: 28,
      location: 'New York',
      goal: 'Weight Loss',
      workout: 'Gym',
      weight: 85,
      height: 180,
      target_weight: 75,
      avatar_url: null,
      latitude: 40.7128,
      longitude: -74.0060
    }
  ],
  workouts: [
    {
      id: '1',
      user_id: '1',
      type: 'Running',
      duration: 30,
      distance: 5,
      calories: 300,
      notes: 'Morning jog',
      created_at: new Date()
    }
  ],
  buddies: [],
  goals: [],
  achievements: [],
  challenges: []
};

// ==================== PROFILES ENDPOINTS ====================

// GET all profiles
app.get('/api/profiles', (req, res) => {
  res.json(mockData.profiles);
});

// GET single profile by ID
app.get('/api/profiles/:id', (req, res) => {
  const profile = mockData.profiles.find(p => p.id === req.params.id);
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }
  res.json(profile);
});

// GET profile by email
app.get('/api/profiles/email/:email', (req, res) => {
  const profile = mockData.profiles.find(p => p.email === req.params.email);
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }
  res.json(profile);
});

// GET profile by username
app.get('/api/profiles/username/:username', (req, res) => {
  const profile = mockData.profiles.find(p => p.username === req.params.username);
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }
  res.json(profile);
});

// POST create profile
app.post('/api/profiles', (req, res) => {
  const newProfile = {
    id: Date.now().toString(),
    ...req.body,
    created_at: new Date()
  };
  mockData.profiles.push(newProfile);
  res.status(201).json(newProfile);
});

// PUT update profile
app.put('/api/profiles/:id', (req, res) => {
  const profileIndex = mockData.profiles.findIndex(p => p.id === req.params.id);
  if (profileIndex === -1) {
    return res.status(404).json({ message: 'Profile not found' });
  }
  
  mockData.profiles[profileIndex] = {
    ...mockData.profiles[profileIndex],
    ...req.body,
    updated_at: new Date()
  };
  
  res.json(mockData.profiles[profileIndex]);
});

// DELETE profile
app.delete('/api/profiles/:id', (req, res) => {
  const profileIndex = mockData.profiles.findIndex(p => p.id === req.params.id);
  if (profileIndex === -1) {
    return res.status(404).json({ message: 'Profile not found' });
  }
  
  const deletedProfile = mockData.profiles.splice(profileIndex, 1);
  res.json({ message: 'Profile deleted', profile: deletedProfile[0] });
});

// ==================== WORKOUTS ENDPOINTS ====================

// GET workouts for user
app.get('/api/workouts/user/:userId', (req, res) => {
  const userWorkouts = mockData.workouts.filter(w => w.user_id === req.params.userId);
  res.json(userWorkouts);
});

// GET single workout
app.get('/api/workouts/:id', (req, res) => {
  const workout = mockData.workouts.find(w => w.id === req.params.id);
  if (!workout) {
    return res.status(404).json({ message: 'Workout not found' });
  }
  res.json(workout);
});

// POST create workout
app.post('/api/workouts', (req, res) => {
  const newWorkout = {
    id: Date.now().toString(),
    ...req.body,
    created_at: new Date()
  };
  mockData.workouts.push(newWorkout);
  res.status(201).json(newWorkout);
});

// PUT update workout
app.put('/api/workouts/:id', (req, res) => {
  const workoutIndex = mockData.workouts.findIndex(w => w.id === req.params.id);
  if (workoutIndex === -1) {
    return res.status(404).json({ message: 'Workout not found' });
  }
  
  mockData.workouts[workoutIndex] = {
    ...mockData.workouts[workoutIndex],
    ...req.body,
    updated_at: new Date()
  };
  
  res.json(mockData.workouts[workoutIndex]);
});

// DELETE workout
app.delete('/api/workouts/:id', (req, res) => {
  const workoutIndex = mockData.workouts.findIndex(w => w.id === req.params.id);
  if (workoutIndex === -1) {
    return res.status(404).json({ message: 'Workout not found' });
  }
  
  const deletedWorkout = mockData.workouts.splice(workoutIndex, 1);
  res.json({ message: 'Workout deleted', workout: deletedWorkout[0] });
});

// ==================== BUDDIES ENDPOINTS ====================

// GET buddies for user
app.get('/api/buddies/user/:userId', (req, res) => {
  const userBuddies = mockData.buddies.filter(b => b.user_id === req.params.userId);
  res.json(userBuddies);
});

// GET pending requests
app.get('/api/buddies/pending/:userId', (req, res) => {
  const pendingRequests = mockData.buddies.filter(
    b => (b.user_id === req.params.userId || b.buddy_id === req.params.userId) && b.status === 'pending'
  );
  res.json(pendingRequests);
});

// GET single buddy connection
app.get('/api/buddies/:id', (req, res) => {
  const buddy = mockData.buddies.find(b => b.id === req.params.id);
  if (!buddy) {
    return res.status(404).json({ message: 'Buddy connection not found' });
  }
  res.json(buddy);
});

// POST create buddy connection
app.post('/api/buddies', (req, res) => {
  const newBuddy = {
    id: Date.now().toString(),
    ...req.body,
    created_at: new Date()
  };
  mockData.buddies.push(newBuddy);
  res.status(201).json(newBuddy);
});

// PUT update buddy connection
app.put('/api/buddies/:id', (req, res) => {
  const buddyIndex = mockData.buddies.findIndex(b => b.id === req.params.id);
  if (buddyIndex === -1) {
    return res.status(404).json({ message: 'Buddy connection not found' });
  }
  
  mockData.buddies[buddyIndex] = {
    ...mockData.buddies[buddyIndex],
    ...req.body,
    updated_at: new Date()
  };
  
  res.json(mockData.buddies[buddyIndex]);
});

// DELETE buddy connection
app.delete('/api/buddies/:id', (req, res) => {
  const buddyIndex = mockData.buddies.findIndex(b => b.id === req.params.id);
  if (buddyIndex === -1) {
    return res.status(404).json({ message: 'Buddy connection not found' });
  }
  
  const deletedBuddy = mockData.buddies.splice(buddyIndex, 1);
  res.json({ message: 'Buddy connection deleted', buddy: deletedBuddy[0] });
});

// ==================== GOALS ENDPOINTS ====================

// GET goals for user
app.get('/api/goals/user/:userId', (req, res) => {
  const userGoals = mockData.goals.filter(g => g.user_id === req.params.userId);
  res.json(userGoals);
});

// GET single goal
app.get('/api/goals/:id', (req, res) => {
  const goal = mockData.goals.find(g => g.id === req.params.id);
  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }
  res.json(goal);
});

// POST create goal
app.post('/api/goals', (req, res) => {
  const newGoal = {
    id: Date.now().toString(),
    ...req.body,
    created_at: new Date()
  };
  mockData.goals.push(newGoal);
  res.status(201).json(newGoal);
});

// PUT update goal
app.put('/api/goals/:id', (req, res) => {
  const goalIndex = mockData.goals.findIndex(g => g.id === req.params.id);
  if (goalIndex === -1) {
    return res.status(404).json({ message: 'Goal not found' });
  }
  
  mockData.goals[goalIndex] = {
    ...mockData.goals[goalIndex],
    ...req.body,
    updated_at: new Date()
  };
  
  res.json(mockData.goals[goalIndex]);
});

// DELETE goal
app.delete('/api/goals/:id', (req, res) => {
  const goalIndex = mockData.goals.findIndex(g => g.id === req.params.id);
  if (goalIndex === -1) {
    return res.status(404).json({ message: 'Goal not found' });
  }
  
  const deletedGoal = mockData.goals.splice(goalIndex, 1);
  res.json({ message: 'Goal deleted', goal: deletedGoal[0] });
});

// ==================== ACHIEVEMENTS ENDPOINTS ====================

// GET achievements for user
app.get('/api/achievements/user/:userId', (req, res) => {
  const userAchievements = mockData.achievements.filter(a => a.user_id === req.params.userId);
  res.json(userAchievements);
});

// GET single achievement
app.get('/api/achievements/:id', (req, res) => {
  const achievement = mockData.achievements.find(a => a.id === req.params.id);
  if (!achievement) {
    return res.status(404).json({ message: 'Achievement not found' });
  }
  res.json(achievement);
});

// POST create achievement
app.post('/api/achievements', (req, res) => {
  const newAchievement = {
    id: Date.now().toString(),
    ...req.body,
    created_at: new Date()
  };
  mockData.achievements.push(newAchievement);
  res.status(201).json(newAchievement);
});

// PUT update achievement
app.put('/api/achievements/:id', (req, res) => {
  const achievementIndex = mockData.achievements.findIndex(a => a.id === req.params.id);
  if (achievementIndex === -1) {
    return res.status(404).json({ message: 'Achievement not found' });
  }
  
  mockData.achievements[achievementIndex] = {
    ...mockData.achievements[achievementIndex],
    ...req.body,
    updated_at: new Date()
  };
  
  res.json(mockData.achievements[achievementIndex]);
});

// DELETE achievement
app.delete('/api/achievements/:id', (req, res) => {
  const achievementIndex = mockData.achievements.findIndex(a => a.id === req.params.id);
  if (achievementIndex === -1) {
    return res.status(404).json({ message: 'Achievement not found' });
  }
  
  const deletedAchievement = mockData.achievements.splice(achievementIndex, 1);
  res.json({ message: 'Achievement deleted', achievement: deletedAchievement[0] });
});

// ==================== CHALLENGES ENDPOINTS ====================

// GET all challenges
app.get('/api/challenges', (req, res) => {
  res.json(mockData.challenges);
});

// GET challenges for user
app.get('/api/challenges/user/:userId', (req, res) => {
  const userChallenges = mockData.challenges.filter(c => c.user_id === req.params.userId);
  res.json(userChallenges);
});

// GET single challenge
app.get('/api/challenges/:id', (req, res) => {
  const challenge = mockData.challenges.find(c => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ message: 'Challenge not found' });
  }
  res.json(challenge);
});

// POST create challenge
app.post('/api/challenges', (req, res) => {
  const newChallenge = {
    id: Date.now().toString(),
    ...req.body,
    created_at: new Date()
  };
  mockData.challenges.push(newChallenge);
  res.status(201).json(newChallenge);
});

// PUT update challenge
app.put('/api/challenges/:id', (req, res) => {
  const challengeIndex = mockData.challenges.findIndex(c => c.id === req.params.id);
  if (challengeIndex === -1) {
    return res.status(404).json({ message: 'Challenge not found' });
  }
  
  mockData.challenges[challengeIndex] = {
    ...mockData.challenges[challengeIndex],
    ...req.body,
    updated_at: new Date()
  };
  
  res.json(mockData.challenges[challengeIndex]);
});

// DELETE challenge
app.delete('/api/challenges/:id', (req, res) => {
  const challengeIndex = mockData.challenges.findIndex(c => c.id === req.params.id);
  if (challengeIndex === -1) {
    return res.status(404).json({ message: 'Challenge not found' });
  }
  
  const deletedChallenge = mockData.challenges.splice(challengeIndex, 1);
  res.json({ message: 'Challenge deleted', challenge: deletedChallenge[0] });
});

// ==================== HEALTH CHECK ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FitnessBuddy Backend is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FitnessBuddy Backend Server running at http://localhost:${PORT}`);
  console.log(`📝 API Base URL: http://localhost:${PORT}/api`);
  console.log(`✅ Health Check: http://localhost:${PORT}/api/health`);
});
