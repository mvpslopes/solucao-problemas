import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ResultModal({ isOpen, onClose, title, content, onSave }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-primary" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {typeof content === 'string' ? (
              <p className="text-text-primary whitespace-pre-line">{content}</p>
            ) : (
              <div className="text-text-primary space-y-3">{content}</div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-text-primary hover:bg-gray-600 transition-colors"
            >
              Fechar
            </motion.button>
            {onSave && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSave}
                className="px-4 py-2 rounded-lg bg-secondary text-white hover:bg-green-600 transition-colors"
              >
                Salvar Estudo
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

