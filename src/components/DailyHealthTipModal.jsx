import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getTodaysTip, hasTipBeenShownToday, markTipAsShownToday } from "../utils/healthTips"
import { useAuth } from "../context/AuthContext"
import { X, Lightbulb } from "lucide-react"

export default function DailyHealthTipModal() {
  const { user } = useAuth()
  const [showTip, setShowTip] = useState(false)
  const [tip, setTip] = useState(null)

  useEffect(() => {
    // Only show tip once per day after user logs in
    if (user && !hasTipBeenShownToday(user.id)) {
      const todaysTip = getTodaysTip()
      setTip(todaysTip)
      setShowTip(true)
      markTipAsShownToday(user.id)
    }
  }, [user])

  const handleClose = () => {
    setShowTip(false)
  }

  return (
    <AnimatePresence>
      {showTip && tip && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/10 dark:to-secondary/10 border-2 border-primary dark:border-secondary rounded-2xl p-8 max-w-md shadow-2xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-8 h-8 text-yellow-500 animate-bounce" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Daily Tip
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <p className="text-lg text-gray-800 dark:text-gray-200 mb-6 leading-relaxed">
              {tip.tip}
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition"
              >
                Got it! 💪
              </button>
            </div>

            <span className="inline-block mt-4 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
              {tip.category.replace(/[-_]/g, " ").toUpperCase()}
            </span>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
