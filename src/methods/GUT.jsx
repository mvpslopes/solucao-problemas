import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Plus, Trash2, Sparkles, Save } from 'lucide-react'
import ResultModal from '../components/ResultModal'

export default function GUT({ onSave, loadedStudy = null }) {
  const [problems, setProblems] = useState([{ id: Date.now(), description: '', gravity: 1, urgency: 1, tendency: 1 }])
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (loadedStudy && loadedStudy.data) {
      if (loadedStudy.data.problems) {
        setProblems(loadedStudy.data.problems)
      }
    }
  }, [loadedStudy])

  const addProblem = () => {
    setProblems([...problems, { id: Date.now(), description: '', gravity: 1, urgency: 1, tendency: 1 }])
  }

  const removeProblem = (id) => {
    if (problems.length > 1) {
      setProblems(problems.filter(p => p.id !== id))
    }
  }

  const updateProblem = (id, field, value) => {
    setProblems(problems.map(p => 
      p.id === id ? { ...p, [field]: field === 'description' ? value : parseInt(value) || 1 } : p
    ))
  }

  const calculatePriority = (problem) => {
    return problem.gravity * problem.urgency * problem.tendency
  }

  const generateSummary = () => {
    const filledProblems = problems.filter(p => p.description.trim() !== '')
    
    if (filledProblems.length === 0) {
      alert('Adicione pelo menos um problema para gerar o resumo.')
      return
    }

    const prioritized = filledProblems
      .map(p => ({
        ...p,
        priority: calculatePriority(p)
      }))
      .sort((a, b) => b.priority - a.priority)

    const summary = {
      problems: prioritized,
      totalProblems: prioritized.length,
      highestPriority: prioritized[0],
      analysis: `Análise GUT - ${prioritized.length} problema(s) avaliado(s)\n\n` +
        prioritized.map((p, i) => 
          `${i + 1}. ${p.description}\n` +
          `   G: ${p.gravity} | U: ${p.urgency} | T: ${p.tendency} | Prioridade: ${p.priority}\n`
        ).join('\n') +
        `\nProblema de maior prioridade: ${prioritized[0].description} (Prioridade: ${prioritized[0].priority})`
    }

    setResult(summary)
    setShowResult(true)
  }

  const handleSave = () => {
    if (!result) return

    const study = {
      id: loadedStudy?.id || Date.now().toString(),
      method: 'GUT',
      title: `Análise GUT - ${result.totalProblems} problema(s)`,
      date: loadedStudy?.date || new Date().toISOString(),
      data: result,
    }

    onSave(study)
    setShowResult(false)
    if (!loadedStudy) {
      setProblems([{ id: Date.now(), description: '', gravity: 1, urgency: 1, tendency: 1 }])
      setResult(null)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <Target className="w-8 h-8 text-red-400" />
        <h2 className="text-2xl font-bold text-text-primary">Método GUT</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-6 border border-gray-700"
      >
        <p className="text-text-primary mb-4">
          Priorize problemas baseado em <strong>Gravidade</strong> (impacto), <strong>Urgência</strong> (necessidade de ação) e <strong>Tendência</strong> (evolução esperada).
          Cada dimensão recebe uma pontuação de 1 a 5. A priorização é calculada por: <strong>G × U × T</strong>
        </p>
      </motion.div>

      {problems.map((problem, index) => (
        <motion.div
          key={problem.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card rounded-xl p-6 border border-gray-700 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">Problema {index + 1}</h3>
            {problems.length > 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => removeProblem(problem.id)}
                className="p-2 text-red-400 hover:bg-red-400 hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Descrição do Problema
            </label>
            <textarea
              value={problem.description}
              onChange={(e) => updateProblem(problem.id, 'description', e.target.value)}
              placeholder="Descreva o problema..."
              className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              rows="2"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Gravidade (1-5)
              </label>
              <select
                value={problem.gravity}
                onChange={(e) => updateProblem(problem.id, 'gravity', e.target.value)}
                className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n} - {n === 1 ? 'Muito Baixa' : n === 2 ? 'Baixa' : n === 3 ? 'Média' : n === 4 ? 'Alta' : 'Muito Alta'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Urgência (1-5)
              </label>
              <select
                value={problem.urgency}
                onChange={(e) => updateProblem(problem.id, 'urgency', e.target.value)}
                className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n} - {n === 1 ? 'Muito Baixa' : n === 2 ? 'Baixa' : n === 3 ? 'Média' : n === 4 ? 'Alta' : 'Muito Alta'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Tendência (1-5)
              </label>
              <select
                value={problem.tendency}
                onChange={(e) => updateProblem(problem.id, 'tendency', e.target.value)}
                className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n} - {n === 1 ? 'Melhora' : n === 2 ? 'Estável' : n === 3 ? 'Piora Leve' : n === 4 ? 'Piora' : 'Piora Muito'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-bg-primary rounded-lg p-3">
            <p className="text-sm text-gray-400">Prioridade: <span className="text-red-400 font-bold text-lg">{calculatePriority(problem)}</span> (G × U × T)</p>
          </div>
        </motion.div>
      ))}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={addProblem}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-red-400 text-red-400 rounded-lg hover:bg-red-400 hover:bg-opacity-10 transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Adicionar Problema
      </motion.button>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateSummary}
          className="flex items-center gap-2 px-6 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors font-medium"
        >
          <Sparkles className="w-5 h-5" />
          Gerar Resumo e Priorizar
        </motion.button>
      </div>

      <ResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Análise GUT - Priorização"
        content={
          result && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Problemas Priorizados</h3>
                <div className="space-y-3">
                  {result.problems.map((p, i) => (
                    <div key={i} className="bg-bg-primary p-4 rounded-lg border-l-4 border-red-400">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-red-400 font-bold text-lg">#{i + 1}</span>
                        <span className="text-red-400 font-bold">Prioridade: {p.priority}</span>
                      </div>
                      <p className="text-text-primary font-medium mb-2">{p.description}</p>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>G: {p.gravity}</span>
                        <span>U: {p.urgency}</span>
                        <span>T: {p.tendency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-secondary bg-opacity-20 border border-secondary rounded-lg p-4">
                <h4 className="text-secondary font-semibold mb-2">Problema de Maior Prioridade:</h4>
                <p className="text-text-primary">{result.highestPriority.description}</p>
                <p className="text-secondary font-bold mt-2">Prioridade: {result.highestPriority.priority}</p>
              </div>
            </div>
          )
        }
        onSave={handleSave}
      />
    </div>
  )
}
