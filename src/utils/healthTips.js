// Daily health and fitness tips
export const HEALTH_TIPS = [
  {
    id: 1,
    tip: "💧 Drink at least 8 glasses of water daily to stay hydrated and boost metabolism.",
    category: "hydration"
  },
  {
    id: 2,
    tip: "🚶 Walk 10,000 steps daily to maintain cardiovascular health and burn calories.",
    category: "cardio"
  },
  {
    id: 3,
    tip: "😴 Get 7-9 hours of quality sleep each night for better recovery and performance.",
    category: "sleep"
  },
  {
    id: 4,
    tip: "🥗 Eat colorful vegetables to get a variety of nutrients and antioxidants.",
    category: "nutrition"
  },
  {
    id: 5,
    tip: "💪 Include strength training 2-3 times per week to build muscle and bone density.",
    category: "strength"
  },
  {
    id: 6,
    tip: "🧘 Practice meditation or deep breathing for 10 minutes daily to reduce stress.",
    category: "mindfulness"
  },
  {
    id: 7,
    tip: "🍎 Start your day with a healthy breakfast to boost energy and metabolism.",
    category: "nutrition"
  },
  {
    id: 8,
    tip: "⏱️ Do high-intensity interval training (HIIT) for maximum calorie burn in minimal time.",
    category: "cardio"
  },
  {
    id: 9,
    tip: "🤝 Exercise with a friend to stay motivated and make fitness more enjoyable.",
    category: "social"
  },
  {
    id: 10,
    tip: "🏋️ Warm up for 5-10 minutes before workouts to prevent injuries.",
    category: "safety"
  },
  {
    id: 11,
    tip: "🌞 Get sunlight exposure for 15-20 minutes daily for vitamin D production.",
    category: "health"
  },
  {
    id: 12,
    tip: "🚫 Avoid processed foods and choose whole grains for better nutrition.",
    category: "nutrition"
  },
  {
    id: 13,
    tip: "🧠 Set realistic fitness goals and track your progress regularly.",
    category: "mindset"
  },
  {
    id: 14,
    tip: "🍌 Eat a banana before workouts for quick energy and potassium.",
    category: "pre-workout"
  },
  {
    id: 15,
    tip: "🛏️ Establish a consistent sleep schedule by going to bed at the same time daily.",
    category: "sleep"
  },
  {
    id: 16,
    tip: "☕ Limit caffeine intake after 3 PM to avoid sleep disruption.",
    category: "sleep"
  },
  {
    id: 17,
    tip: "🏃 Do light stretching for 5 minutes after workouts to improve flexibility.",
    category: "recovery"
  },
  {
    id: 18,
    tip: "🥤 Replace sugary drinks with water or herbal tea to reduce empty calories.",
    category: "hydration"
  },
  {
    id: 19,
    tip: "📱 Take breaks from screens every 30 minutes to reduce eye strain.",
    category: "wellness"
  },
  {
    id: 20,
    tip: "🎯 Find a workout routine you enjoy - consistency beats perfection!",
    category: "mindset"
  }
]

/**
 * Get today's health tip (same tip for all users on the same day)
 */
export const getTodaysTip = () => {
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)
  const tipIndex = dayOfYear % HEALTH_TIPS.length
  return HEALTH_TIPS[tipIndex]
}

/**
 * Check if the daily tip has been shown today for a specific user
 */
export const hasTipBeenShownToday = (userId) => {
  const lastShownDate = localStorage.getItem(`lastTipShownDate_${userId}`)
  const today = new Date().toDateString()
  return lastShownDate === today
}

/**
 * Mark the tip as shown today for a specific user
 */
export const markTipAsShownToday = (userId) => {
  const today = new Date().toDateString()
  localStorage.setItem(`lastTipShownDate_${userId}`, today)
}

/**
 * Reset tip tracking for a specific user (for testing)
 */
export const resetTipTracking = (userId) => {
  if (userId) {
    localStorage.removeItem(`lastTipShownDate_${userId}`)
  } else {
    // Reset all tip tracking if no userId provided
    const keys = Object.keys(localStorage).filter(key => key.startsWith("lastTipShownDate_"))
    keys.forEach(key => localStorage.removeItem(key))
  }
}
