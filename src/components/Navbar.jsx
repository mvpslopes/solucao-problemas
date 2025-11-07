import { History, Home, Info } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  const location = useLocation()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 bg-card border-b border-gray-700 flex items-center justify-between px-6"
    >
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center"
          >
            <span className="text-white font-bold text-sm">R</span>
          </motion.div>
          <span className="text-xl font-bold text-text-primary">ResolvAI</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${
              location.pathname === '/'
                ? 'bg-primary text-white'
                : 'bg-card hover:bg-opacity-80 text-text-primary'
            }`}
          >
            <Home className="w-5 h-5" />
          </motion.button>
        </Link>
        <Link to="/history">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${
              location.pathname === '/history'
                ? 'bg-primary text-white'
                : 'bg-card hover:bg-opacity-80 text-text-primary'
            }`}
          >
            <History className="w-5 h-5" />
          </motion.button>
        </Link>
        <Link to="/about">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${
              location.pathname === '/about'
                ? 'bg-primary text-white'
                : 'bg-card hover:bg-opacity-80 text-text-primary'
            }`}
          >
            <Info className="w-5 h-5" />
          </motion.button>
        </Link>
      </div>
    </motion.nav>
  )
}

