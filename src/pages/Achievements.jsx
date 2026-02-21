import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { Trophy, Star, Award, Zap, Flame, Facebook, Twitter, Linkedin, Share2, X, MessageCircle, UserPlus, CheckCircle } from "lucide-react"
import PageTransition from "../components/PageTransition"
import { ACHIEVEMENT_BADGES } from "../utils/achievementUtils"

export default function Achievements() {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState([])
  const [leaderboardPoints, setLeaderboardPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("myAchievements") // myAchievements or allUsers
  const [allUsersAchievements, setAllUsersAchievements] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedUserDetails, setSelectedUserDetails] = useState(null)
  const [selectedUserAchievements, setSelectedUserAchievements] = useState([])

  useEffect(() => {
    if (user) fetchAchievements()
    
    // Listen for updates with a small delay to ensure database sync
    const handleUpdate = () => {
      if (user) {
        console.log("Achievement update event triggered, refetching after 500ms...")
        setTimeout(() => {
          fetchAchievements()
        }, 500)
      }
    }
    
    window.addEventListener('achievementsUpdate', handleUpdate)
    window.addEventListener('leaderboardUpdate', handleUpdate)
    
    return () => {
      window.removeEventListener('achievementsUpdate', handleUpdate)
      window.removeEventListener('leaderboardUpdate', handleUpdate)
    }
  }, [user])

  const fetchAchievements = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      // Fetch workouts to calculate leaderboard points
      const { data: workouts } = await supabase
        .from("workouts")
        .select("duration, calories")
        .eq("user_id", user.id)

      // Calculate leaderboard points (same formula as Leaderboard)
      if (workouts && workouts.length > 0) {
        const totalMinutes = workouts.reduce((sum, w) => sum + (w.duration || 0), 0)
        const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0)
        const workoutCount = workouts.length
        
        // Points: 10 per workout + 1 per minute + 0.1 per calorie
        const points = (workoutCount * 10) + (totalMinutes * 1) + (totalCalories * 0.1)
        setLeaderboardPoints(Math.round(points))
      } else {
        setLeaderboardPoints(0)
      }

      setAchievements(data || [])

      // Fetch all users with their achievements
      await fetchAllUsersAchievements()
    } catch (error) {
      console.error("Error fetching achievements:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllUsersAchievements = async () => {
    try {
      // Fetch all profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, goal")

      // Fetch all workouts
      const { data: workouts } = await supabase
        .from("workouts")
        .select("user_id, duration, calories")

      // Fetch all achievements
      const { data: allAchievements } = await supabase
        .from("achievements")
        .select("*")

      if (profiles) {
        // Calculate stats for each user
        const usersData = profiles.map(profile => {
          const userWorkouts = workouts?.filter(w => w.user_id === profile.id) || []
          const userAchievements = allAchievements?.filter(a => a.user_id === profile.id) || []
          
          const totalMinutes = userWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0)
          const totalCalories = userWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0)
          const workoutCount = userWorkouts.length
          const points = (workoutCount * 10) + (totalMinutes * 1) + (totalCalories * 0.1)

          return {
            ...profile,
            workouts: workoutCount,
            minutes: totalMinutes,
            calories: totalCalories,
            points: Math.round(points),
            achievementCount: userAchievements.length,
            achievements: userAchievements
          }
        })
        
        // Sort by points descending
        const sorted = usersData.sort((a, b) => b.points - a.points)
        setAllUsersAchievements(sorted)
      }
    } catch (error) {
      console.error("Error fetching all users achievements:", error)
    }
  }

  const viewUserDetails = (userProfile) => {
    setSelectedUser(userProfile)
    setSelectedUserDetails(userProfile)
    setSelectedUserAchievements(userProfile.achievements || [])
  }

  const closeUserModal = () => {
    setSelectedUser(null)
    setSelectedUserDetails(null)
    setSelectedUserAchievements([])
  }

  const shareBadge = (badge) => {
    const text = `🎉 I just unlocked the "${badge.name}" badge on Fitness Buddy! ${badge.icon}\n\n"${badge.description}"\n\nJoin me in my fitness journey and unlock amazing badges! 💪 #FitnessBuddy #Achievements`

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}&hashtag=%23FitnessBuddy`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=fitnesbuddy.com`
    }

    return urls
  }

  const handleShare = (badge, platform) => {
    const urls = shareBadge(badge)
    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400")
    }
  }

  const allBadges = Object.values(ACHIEVEMENT_BADGES).map(badge => ({
    ...badge,
    unlocked: achievements.some(a => a.badge_type === badge.id)
  }))

  const rarityColors = {
    common: "from-accent to-light",
    rare: "from-secondary to-darkGreen",
    epic: "from-primary to-secondary",
    legendary: "from-darkGreen to-primary",
    mythic: "from-accent to-darkGreen"
  }

  const rarityBorders = {
    common: "border-gray-500",
    rare: "border-blue-500",
    epic: "border-purple-500",
    legendary: "border-yellow-500",
    mythic: "border-primary"
  }

  const totalAchievementPoints = achievements.reduce((sum, a) => {
    const badge = ACHIEVEMENT_BADGES[a.badge_type]
    return sum + (badge?.points || 0)
  }, 0)

  const totalPoints = totalAchievementPoints + leaderboardPoints

  const unlockedCount = achievements.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3EED4] to-[#AEC3B0] dark:from-[#0F2A1D] dark:to-[#375534] p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
            🏆 Achievements & Badges
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Earn badges and unlock rewards for your fitness milestones
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-4 mb-8 bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-lg w-fit">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode("myAchievements")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              viewMode === "myAchievements"
                ? "bg-gradient-to-r from-primary to-secondary text-light"
                : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            My Achievements
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode("allUsers")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              viewMode === "allUsers"
                ? "bg-gradient-to-r from-primary to-secondary text-light"
                : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Community Achievements
          </motion.button>
        </div>

        {viewMode === "myAchievements" ? (
          <>
            {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Achievement Points</p>
                <p className="text-4xl font-bold text-secondary dark:text-darkGreen">{totalAchievementPoints}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">from badges</p>
              </div>
              <Star className="w-12 h-12 text-secondary dark:text-darkGreen" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Points</p>
                <p className="text-4xl font-bold text-secondary dark:text-darkGreen">{totalPoints}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">achievement points</p>
              </div>
              <Star className="w-12 h-12 text-secondary dark:text-darkGreen" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/10 dark:to-secondary/10 rounded-2xl p-6 shadow-lg border-2 border-gradient-to-r border-primary dark:border-secondary"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Progress</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {Math.round((unlockedCount / allBadges.length) * 100)}%
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">completion</p>
              </div>
              <Zap className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg mb-8"
        >
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Points Breakdown
          </p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Achievement Points</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {totalPoints > 0 ? Math.round((totalAchievementPoints / totalPoints) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: totalPoints > 0 ? `${(totalAchievementPoints / totalPoints) * 100}%` : "0%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-secondary to-darkGreen rounded-full"
                ></motion.div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Leaderboard Points</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {totalPoints > 0 ? Math.round((leaderboardPoints / totalPoints) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: totalPoints > 0 ? `${(leaderboardPoints / totalPoints) * 100}%` : "0%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                ></motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievement Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg mb-8"
        >
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Badge Progress
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / allBadges.length) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            ></motion.div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {unlockedCount} of {allBadges.length} badges unlocked
          </p>
        </motion.div>

        {/* Badges Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={badge.unlocked ? { scale: 1.05 } : {}}
              className={`relative ${badge.unlocked ? "" : "opacity-60"}`}
            >
              <div
                className={`${
                  badge.unlocked
                    ? `bg-gradient-to-br ${rarityColors[badge.rarity]} shadow-xl border-2 ${rarityBorders[badge.rarity]}`
                    : "bg-gray-300 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600"
                } rounded-2xl p-6 text-center h-full flex flex-col justify-center items-center hover:shadow-2xl transition`}
              >
                {badge.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold"
                  >
                    ✓
                  </motion.div>
                )}

                <div className="text-6xl mb-3">{badge.icon}</div>
                <h3 className={`font-bold text-lg mb-1 ${badge.unlocked ? "text-white" : "text-gray-700 dark:text-gray-400"}`}>
                  {badge.name}
                </h3>
                <p className={`text-sm mb-3 ${badge.unlocked ? "text-white/80" : "text-gray-600 dark:text-gray-500"}`}>
                  {badge.description}
                </p>

                <div className="flex items-center justify-center gap-1 mt-auto mb-3">
                  <span className={`text-sm font-bold ${badge.unlocked ? "text-white" : "text-gray-600 dark:text-gray-500"}`}>
                    +{badge.points}
                  </span>
                  <Star className="w-4 h-4" fill="currentColor" />
                </div>

                {badge.unlocked && (
                  <div className="flex gap-2 justify-center mb-2 w-full">
                    <motion.button
                      onClick={() => handleShare(badge, "twitter")}
                      whileHover={{ scale: 1.1 }}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                      title="Share on Twitter"
                    >
                      <Twitter className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleShare(badge, "facebook")}
                      whileHover={{ scale: 1.1 }}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                      title="Share on Facebook"
                    >
                      <Facebook className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleShare(badge, "linkedin")}
                      whileHover={{ scale: 1.1 }}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                )}

                {!badge.unlocked && (
                  <div
                    className={`text-xs font-semibold mt-3 px-2 py-1 rounded ${
                      badge.rarity === "mythic"
                        ? "bg-red-200 text-red-700"
                        : badge.rarity === "legendary"
                          ? "bg-yellow-200 text-yellow-700"
                          : badge.rarity === "epic"
                            ? "bg-purple-200 text-purple-700"
                            : badge.rarity === "rare"
                              ? "bg-blue-200 text-blue-700"
                              : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {badge.rarity.toUpperCase()}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {unlockedCount === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 mt-8"
          >
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              Start working out to unlock your first badge!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Each activity, challenge completed, and milestone achieved brings you closer to unlocking amazing badges.
            </p>
          </motion.div>
        )}

        {/* Badge Legend */}
        {unlockedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Rarity Levels</h3>
            <div className="grid md:grid-cols-5 gap-4">
              {Object.entries(rarityColors).map(([rarity, color]) => (
                <div key={rarity} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${color}`}></div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">
                    {rarity}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
          </>
        ) : (
          // All Users View
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block">
                  <div className="w-12 h-12 rounded-full border-4 border-accent border-t-primary animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading achievements...</p>
              </div>
            ) : allUsersAchievements.length > 0 ? (
              allUsersAchievements.map((userProfile, index) => (
                <motion.div
                  key={userProfile.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => userProfile.id !== user.id && viewUserDetails(userProfile)}
                  className={`cursor-pointer bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition ${
                    userProfile.id === user.id ? "ring-2 ring-orange-500" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* User Info */}
                    <div className="flex items-center gap-4 flex-1">
                      {userProfile.avatar_url ? (
                        <img
                          src={userProfile.avatar_url}
                          alt={userProfile.username}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                          {userProfile.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {userProfile.username}
                          {userProfile.id === user.id && (
                            <span className="text-sm ml-2 text-orange-600 dark:text-orange-400">(You)</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          🏆 {userProfile.achievementCount} achievement{userProfile.achievementCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 ml-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Workouts</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile.workouts}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Points</p>
                        <p className="text-2xl font-bold text-primary">{userProfile.points}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No achievements yet
                </p>
              </div>
            )}
          </div>
        )}

        {/* User Details Modal */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeUserModal}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeUserModal}
                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>

                  <div className="flex items-center gap-4">
                    {selectedUserDetails?.avatar_url ? (
                      <img
                        src={selectedUserDetails.avatar_url}
                        alt={selectedUserDetails.username}
                        className="w-16 h-16 rounded-full border-2 border-white object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-3xl">
                        💪
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedUserDetails?.username}
                      </h2>
                      <p className="text-white/80 text-sm">
                        Rank #{allUsersAchievements.findIndex(u => u.id === selectedUser?.id) + 1}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Workouts</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedUserDetails?.workouts}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Minutes</p>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{selectedUserDetails?.minutes}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Calories</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{selectedUserDetails?.calories}</p>
                    </div>
                  </div>

                  {/* Goal */}
                  {selectedUserDetails?.goal && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Goal</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedUserDetails.goal}
                      </p>
                    </div>
                  )}

                  {/* Achievements */}
                  {selectedUserAchievements.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                        <Trophy className="w-4 h-4 mr-2" />
                        Achievements ({selectedUserAchievements.length})
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {selectedUserAchievements.slice(0, 8).map((achievement, idx) => {
                          const badge = ACHIEVEMENT_BADGES[achievement.badge_type]
                          return (
                            <div
                              key={idx}
                              className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-lg shadow-md"
                              title={badge?.name || achievement.badge_type}
                            >
                              {badge?.icon || '✓'}
                            </div>
                          )
                        })}
                        {selectedUserAchievements.length > 8 && (
                          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-300">
                            +{selectedUserAchievements.length - 8}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Points Info */}
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Points</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{selectedUserDetails?.points}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
