// API Configuration for local Node.js backend
// This service provides a unified API interface for the app

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

/**
 * Generic fetch wrapper for API calls
 */
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }

  try {
    const response = await fetch(url, { ...defaultOptions, ...options })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }))
      throw new Error(error.message || `API Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Call Error (${endpoint}):`, error)
    throw error
  }
}

/**
 * GET request
 */
export const apiGet = (endpoint, options = {}) => {
  return apiCall(endpoint, { ...options, method: 'GET' })
}

/**
 * POST request
 */
export const apiPost = (endpoint, data, options = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * PUT request
 */
export const apiPut = (endpoint, data, options = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

/**
 * DELETE request
 */
export const apiDelete = (endpoint, options = {}) => {
  return apiCall(endpoint, { ...options, method: 'DELETE' })
}

/**
 * Profiles API
 */
export const ProfileAPI = {
  // Get all profiles
  getAll: () => apiGet('/profiles'),
  
  // Get single profile
  getById: (id) => apiGet(`/profiles/${id}`),
  
  // Create profile
  create: (profileData) => apiPost('/profiles', profileData),
  
  // Update profile
  update: (id, profileData) => apiPut(`/profiles/${id}`, profileData),
  
  // Delete profile
  delete: (id) => apiDelete(`/profiles/${id}`),
  
  // Get profile by email
  getByEmail: (email) => apiGet(`/profiles/email/${email}`),
  
  // Get profile by username
  getByUsername: (username) => apiGet(`/profiles/username/${username}`)
}

/**
 * Workouts API
 */
export const WorkoutAPI = {
  // Get all workouts for user
  getUserWorkouts: (userId) => apiGet(`/workouts/user/${userId}`),
  
  // Get single workout
  getById: (id) => apiGet(`/workouts/${id}`),
  
  // Create workout
  create: (workoutData) => apiPost('/workouts', workoutData),
  
  // Update workout
  update: (id, workoutData) => apiPut(`/workouts/${id}`, workoutData),
  
  // Delete workout
  delete: (id) => apiDelete(`/workouts/${id}`)
}

/**
 * Buddies API
 */
export const BuddyAPI = {
  // Get all buddies for user
  getUserBuddies: (userId) => apiGet(`/buddies/user/${userId}`),
  
  // Get single buddy connection
  getById: (id) => apiGet(`/buddies/${id}`),
  
  // Create buddy connection
  create: (buddyData) => apiPost('/buddies', buddyData),
  
  // Update buddy connection
  update: (id, buddyData) => apiPut(`/buddies/${id}`, buddyData),
  
  // Delete buddy connection
  delete: (id) => apiDelete(`/buddies/${id}`),
  
  // Get pending requests for user
  getPendingRequests: (userId) => apiGet(`/buddies/pending/${userId}`)
}

/**
 * Goals API
 */
export const GoalAPI = {
  // Get all goals for user
  getUserGoals: (userId) => apiGet(`/goals/user/${userId}`),
  
  // Get single goal
  getById: (id) => apiGet(`/goals/${id}`),
  
  // Create goal
  create: (goalData) => apiPost('/goals', goalData),
  
  // Update goal
  update: (id, goalData) => apiPut(`/goals/${id}`, goalData),
  
  // Delete goal
  delete: (id) => apiDelete(`/goals/${id}`)
}

/**
 * Achievements API
 */
export const AchievementAPI = {
  // Get achievements for user
  getUserAchievements: (userId) => apiGet(`/achievements/user/${userId}`),
  
  // Get single achievement
  getById: (id) => apiGet(`/achievements/${id}`),
  
  // Create achievement
  create: (achievementData) => apiPost('/achievements', achievementData),
  
  // Update achievement
  update: (id, achievementData) => apiPut(`/achievements/${id}`, achievementData),
  
  // Delete achievement
  delete: (id) => apiDelete(`/achievements/${id}`)
}

/**
 * Challenges API
 */
export const ChallengeAPI = {
  // Get all challenges
  getAll: () => apiGet('/challenges'),
  
  // Get single challenge
  getById: (id) => apiGet(`/challenges/${id}`),
  
  // Create challenge
  create: (challengeData) => apiPost('/challenges', challengeData),
  
  // Update challenge
  update: (id, challengeData) => apiPut(`/challenges/${id}`, challengeData),
  
  // Delete challenge
  delete: (id) => apiDelete(`/challenges/${id}`),
  
  // Get challenges for user
  getUserChallenges: (userId) => apiGet(`/challenges/user/${userId}`)
}

export default {
  apiCall,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  ProfileAPI,
  WorkoutAPI,
  BuddyAPI,
  GoalAPI,
  AchievementAPI,
  ChallengeAPI
}
