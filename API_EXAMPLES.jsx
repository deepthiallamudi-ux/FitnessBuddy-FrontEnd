/**
 * Example: Using the API Service in React Components
 * 
 * This file demonstrates how to use the new API service
 * to make requests to the local Node.js backend
 */

import { useEffect, useState } from 'react'
import { ProfileAPI, WorkoutAPI } from '../lib/api'

/**
 * Example 1: Fetch all profiles
 */
export function ProfilesExample() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await ProfileAPI.getAll()
        setProfiles(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching profiles:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [])

  if (loading) return <div>Loading profiles...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>All Profiles</h2>
      <ul>
        {profiles.map(profile => (
          <li key={profile.id}>{profile.username} - {profile.location}</li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Example 2: Fetch and update profile
 */
export function ProfileEditExample({ userId }) {
  const [profile, setProfile] = useState(null)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await ProfileAPI.getById(userId)
        setProfile(data)
        setUsername(data.username)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching profile:', err)
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  const handleUpdate = async () => {
    try {
      const updated = await ProfileAPI.update(userId, { username })
      setProfile(updated)
      alert('Profile updated successfully!')
    } catch (err) {
      alert('Error updating profile: ' + err.message)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2>Edit Profile</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  )
}

/**
 * Example 3: Create new workout
 */
export function CreateWorkoutExample({ userId }) {
  const [type, setType] = useState('')
  const [duration, setDuration] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newWorkout = await WorkoutAPI.create({
        user_id: userId,
        type,
        duration: parseInt(duration),
        calories: parseInt(duration) * 5 // Example calculation
      })

      alert('Workout created successfully!')
      setType('')
      setDuration('')
    } catch (err) {
      alert('Error creating workout: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Create Workout</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Workout Type (e.g., Running)"
          required
        />
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (minutes)"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Workout'}
        </button>
      </form>
    </div>
  )
}

/**
 * Example 4: Fetch user's workouts
 */
export function UserWorkoutsExample({ userId }) {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await WorkoutAPI.getUserWorkouts(userId)
        setWorkouts(data)
      } catch (err) {
        console.error('Error fetching workouts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [userId])

  if (loading) return <div>Loading workouts...</div>

  return (
    <div>
      <h2>Your Workouts</h2>
      <div>
        {workouts.length === 0 ? (
          <p>No workouts yet</p>
        ) : (
          <ul>
            {workouts.map(workout => (
              <li key={workout.id}>
                {workout.type} - {workout.duration} mins ({workout.calories} cal)
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/**
 * Example 5: Delete workout
 */
export function DeleteWorkoutExample({ workoutId, onDelete }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return
    }

    setLoading(true)
    try {
      await WorkoutAPI.delete(workoutId)
      alert('Workout deleted successfully!')
      if (onDelete) onDelete(workoutId)
    } catch (err) {
      alert('Error deleting workout: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? 'Deleting...' : 'Delete Workout'}
    </button>
  )
}

/**
 * Example 6: Error handling with API
 */
export function APIErrorHandlingExample() {
  const [error, setError] = useState(null)

  const handleApiCall = async () => {
    try {
      // This will fail if user doesn't exist
      const profile = await ProfileAPI.getById('non-existent-id')
    } catch (err) {
      // Handle different error types
      if (err.message.includes('not found')) {
        setError('Profile not found')
      } else if (err.message.includes('network')) {
        setError('Network error - server may be down')
      } else {
        setError(err.message)
      }
    }
  }

  return (
    <div>
      <button onClick={handleApiCall}>Test API Call</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  )
}
