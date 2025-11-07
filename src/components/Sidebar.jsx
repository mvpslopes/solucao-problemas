import { motion } from 'framer-motion'
import {
  HelpCircle,
  Target,
  TrendingUp,
  RefreshCw,
  CheckSquare,
  FileText,
  GitBranch,
  Lightbulb,
  BookOpen,
} from 'lucide-react'

const methods = [
  { id: 'five-whys', name: '5 Porquês', icon: HelpCircle, color: 'text-primary' },
  { id: 'gut', name: 'GUT', icon: Target, color: 'text-red-400' },
  { id: 'swot', name: 'SWOT', icon: TrendingUp, color: 'text-secondary' },
  { id: 'pdca', name: 'PDCA', icon: RefreshCw, color: 'text-yellow-400' },
  { id: 'smart', name: 'SMART', icon: CheckSquare, color: 'text-purple-400' },
  { id: 'six-w2h', name: '6W2H', icon: FileText, color: 'text-blue-400' },
  { id: 'decision-tree', name: 'Árvore de Decisão', icon: GitBranch, color: 'text-green-400' },
  { id: 'brainstorm', name: 'Brainstorm', icon: Lightbulb, color: 'text-orange-400' },
  { id: 'diary', name: 'Diário', icon: BookOpen, color: 'text-pink-400' },
]

export default function Sidebar({ selectedMethod, onSelectMethod }) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-card border-r border-gray-700 p-4 overflow-y-auto"
    >
      <h2 className="text-lg font-semibold text-text-primary mb-4 px-2">
        Métodos
      </h2>
      <nav className="space-y-2">
        {methods.map((method) => {
          const Icon = method.icon
          return (
            <motion.button
              key={method.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMethod(method.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                selectedMethod === method.id
                  ? 'bg-primary bg-opacity-20 text-primary'
                  : 'text-text-primary hover:bg-gray-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${method.color}`} />
              <span className="text-sm font-medium">{method.name}</span>
            </motion.button>
          )
        })}
      </nav>
    </motion.aside>
  )
}

