import { motion } from "framer-motion"
import { LogOut, Sun, Moon } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

export default function TopBar() {
  const { logout } = useAuth()
  const { dark, setDark } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 right-0 z-50 p-4 flex items-center gap-3"
    >
      {/* Theme Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setDark(!dark)}
        className="p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition"
        title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {dark ? (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="text-yellow-500"
          >
            <Sun size={20} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="text-gray-700"
          >
            <Moon size={20} />
          </motion.div>
        )}
      </motion.button>

      {/* Logout Button */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.98 }}
        onClick={logout}
        className="px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-light font-semibold hover:shadow-lg transition flex items-center gap-2"
        title="Logout"
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">Logout</span>
      </motion.button>
    </motion.div>
  )
}
