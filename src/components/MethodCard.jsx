import { motion } from 'framer-motion'

export default function MethodCard({ title, description, icon: Icon, onClick, color = 'text-primary' }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card rounded-xl p-6 cursor-pointer border border-gray-700 hover:border-primary transition-all"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg bg-opacity-20 ${color.replace('text-', 'bg-')} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}

