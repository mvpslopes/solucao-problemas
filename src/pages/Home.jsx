import { useState, useEffect } from 'react'
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
import MethodCard from '../components/MethodCard'
import Sidebar from '../components/Sidebar'
import FiveWhys from '../methods/FiveWhys'
import GUT from '../methods/GUT'
import SWOT from '../methods/SWOT'
import PDCA from '../methods/PDCA'
import SMART from '../methods/SMART'
import SixW2H from '../methods/SixW2H'
import DecisionTree from '../methods/DecisionTree'
import Brainstorm from '../methods/Brainstorm'
import Diary from '../methods/Diary'

const methods = [
  {
    id: 'five-whys',
    name: '5 Porquês',
    description: 'Identifique a causa raiz de um problema através de perguntas sucessivas.',
    icon: HelpCircle,
    color: 'text-primary',
  },
  {
    id: 'gut',
    name: 'GUT',
    description: 'Priorize problemas baseado em Gravidade, Urgência e Tendência.',
    icon: Target,
    color: 'text-red-400',
  },
  {
    id: 'swot',
    name: 'SWOT',
    description: 'Analise Forças, Fraquezas, Oportunidades e Ameaças de uma situação.',
    icon: TrendingUp,
    color: 'text-secondary',
  },
  {
    id: 'pdca',
    name: 'PDCA',
    description: 'Implemente melhorias contínuas através de ciclos estruturados.',
    icon: RefreshCw,
    color: 'text-yellow-400',
  },
  {
    id: 'smart',
    name: 'SMART',
    description: 'Defina objetivos Específicos, Mensuráveis, Alcançáveis, Relevantes e Temporais.',
    icon: CheckSquare,
    color: 'text-purple-400',
  },
  {
    id: 'six-w2h',
    name: '6W2H',
    description: 'Mapeie todos os aspectos de um problema através de perguntas estruturadas.',
    icon: FileText,
    color: 'text-blue-400',
  },
  {
    id: 'decision-tree',
    name: 'Árvore de Decisão',
    description: 'Visualize diferentes caminhos de decisão e suas consequências.',
    icon: GitBranch,
    color: 'text-green-400',
  },
  {
    id: 'brainstorm',
    name: 'Brainstorm',
    description: 'Gere e organize ideias de forma livre e criativa.',
    icon: Lightbulb,
    color: 'text-orange-400',
  },
  {
    id: 'diary',
    name: 'Diário',
    description: 'Registre reflexões, aprendizados e insights de forma livre.',
    icon: BookOpen,
    color: 'text-pink-400',
  },
]

const methodComponents = {
  'five-whys': FiveWhys,
  gut: GUT,
  swot: SWOT,
  pdca: PDCA,
  smart: SMART,
  'six-w2h': SixW2H,
  'decision-tree': DecisionTree,
  brainstorm: Brainstorm,
  diary: Diary,
}

export default function Home({ onSaveStudy, loadedStudy = null }) {
  const [selectedMethod, setSelectedMethod] = useState(null)

  // Se houver um estudo carregado, selecionar o método automaticamente
  useEffect(() => {
    if (loadedStudy) {
      // Mapear nome do método para o ID
      const methodMap = {
        '5 Porquês': 'five-whys',
        'GUT': 'gut',
        'SWOT': 'swot',
        'PDCA': 'pdca',
        'SMART': 'smart',
        '6W2H': 'six-w2h',
        'Árvore de Decisão': 'decision-tree',
        'Brainstorm': 'brainstorm',
        'Diário': 'diary',
      }
      const methodId = methodMap[loadedStudy.method] || 'five-whys'
      setSelectedMethod(methodId)
    }
  }, [loadedStudy])

  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId)
  }

  const handleSave = (study) => {
    onSaveStudy(study)
  }

  const handleBackToHome = () => {
    setSelectedMethod(null)
    // Limpar estudo carregado ao voltar
    if (loadedStudy) {
      window.location.href = '/'
    }
  }

  const MethodComponent = selectedMethod ? methodComponents[selectedMethod] : null

  if (selectedMethod && MethodComponent) {
    return (
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar selectedMethod={selectedMethod} onSelectMethod={handleSelectMethod} />
        <main className="flex-1 overflow-y-auto p-6">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToHome}
            className="mb-4 px-4 py-2 bg-card hover:bg-opacity-80 text-text-primary rounded-lg transition-colors text-sm"
          >
            ← Voltar para métodos
          </motion.button>
          {loadedStudy && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-primary bg-opacity-20 border border-primary rounded-lg"
            >
              <p className="text-sm text-primary">
                📝 Editando análise: <span className="font-semibold">{loadedStudy.title}</span>
              </p>
            </motion.div>
          )}
          <MethodComponent onSave={handleSave} loadedStudy={loadedStudy} />
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar selectedMethod={selectedMethod} onSelectMethod={handleSelectMethod} />
      <main className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              Bem-vindo ao ResolvAI
            </h1>
            <p className="text-gray-400 text-lg">
              Escolha um método de resolução de problemas para começar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {methods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MethodCard
                  title={method.name}
                  description={method.description}
                  icon={method.icon}
                  color={method.color}
                  onClick={() => handleSelectMethod(method.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}

