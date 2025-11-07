import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X } from 'lucide-react'

export default function Toast({ message, isVisible, onClose, type = 'success' }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            type === 'success' 
              ? 'bg-secondary text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{message}</span>
            <button
              onClick={onClose}
              className="ml-2 hover:opacity-80 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

