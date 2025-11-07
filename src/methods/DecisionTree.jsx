import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GitBranch, Plus, Trash2, Sparkles } from 'lucide-react'
import ResultModal from '../components/ResultModal'

export default function DecisionTree({ onSave, loadedStudy = null }) {
  const [decision, setDecision] = useState('')
  const [options, setOptions] = useState([{ id: Date.now(), description: '', consequences: '', pros: '', cons: '' }])
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (loadedStudy && loadedStudy.data) {
      if (loadedStudy.data.decision) {
        setDecision(loadedStudy.data.decision)
      }
      if (loadedStudy.data.options) {
        setOptions(loadedStudy.data.options)
      }
    }
  }, [loadedStudy])

  const addOption = () => {
    setOptions([...options, { id: Date.now(), description: '', consequences: '', pros: '', cons: '' }])
  }

  const removeOption = (id) => {
    if (options.length > 1) {
      setOptions(options.filter(o => o.id !== id))
    }
  }

  const updateOption = (id, field, value) => {
    setOptions(options.map(o => o.id === id ? { ...o, [field]: value } : o))
  }

  const generateSummary = () => {
    if (!decision.trim()) {
      alert('Defina a decisão antes de gerar o resumo.')
      return
    }

    const filledOptions = options.filter(o => o.description.trim() !== '')

    if (filledOptions.length === 0) {
      alert('Adicione pelo menos uma opção para gerar o resumo.')
      return
    }

    const summary = {
      decision,
      options: filledOptions,
      totalOptions: filledOptions.length,
      analysis: `Árvore de Decisão\n\n` +
        `Decisão: ${decision}\n\n` +
        `Opções avaliadas (${filledOptions.length}):\n\n` +
        filledOptions.map((opt, i) => 
          `OPÇÃO ${i + 1}: ${opt.description}\n` +
          (opt.consequences ? `Consequências: ${opt.consequences}\n` : '') +
          (opt.pros ? `Prós: ${opt.pros}\n` : '') +
          (opt.cons ? `Contras: ${opt.cons}\n` : '')
        ).join('\n')
    }

    setResult(summary)
    setShowResult(true)
  }

  const handleSave = () => {
    if (!result) return

    const study = {
      id: loadedStudy?.id || Date.now().toString(),
      method: 'Árvore de Decisão',
      title: decision || 'Árvore de Decisão',
      date: loadedStudy?.date || new Date().toISOString(),
      data: result,
    }

    onSave(study)
    setShowResult(false)
    if (!loadedStudy) {
      setDecision('')
      setOptions([{ id: Date.now(), description: '', consequences: '', pros: '', cons: '' }])
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
        <GitBranch className="w-8 h-8 text-green-400" />
        <h2 className="text-2xl font-bold text-text-primary">Árvore de Decisão</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-6 border border-gray-700"
      >
        <label className="block text-sm font-medium text-text-primary mb-2">
          Decisão a ser tomada
        </label>
        <textarea
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          placeholder="Descreva a decisão que precisa ser tomada..."
          className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
          rows="2"
        />
      </motion.div>

      {options.map((option, index) => (
        <motion.div
          key={option.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card rounded-xl p-6 border border-gray-700 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">Opção {index + 1}</h3>
            {options.length > 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => removeOption(option.id)}
                className="p-2 text-red-400 hover:bg-red-400 hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Descrição da Opção
            </label>
            <textarea
              value={option.description}
              onChange={(e) => updateOption(option.id, 'description', e.target.value)}
              placeholder="Descreva esta opção..."
              className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Consequências
            </label>
            <textarea
              value={option.consequences}
              onChange={(e) => updateOption(option.id, 'consequences', e.target.value)}
              placeholder="Quais são as consequências desta opção?"
              className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              rows="2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-400 mb-2">
                Prós
              </label>
              <textarea
                value={option.pros}
                onChange={(e) => updateOption(option.id, 'pros', e.target.value)}
                placeholder="Vantagens..."
                className="w-full px-4 py-3 bg-bg-primary border border-green-400 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-400 mb-2">
                Contras
              </label>
              <textarea
                value={option.cons}
                onChange={(e) => updateOption(option.id, 'cons', e.target.value)}
                placeholder="Desvantagens..."
                className="w-full px-4 py-3 bg-bg-primary border border-red-400 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                rows="2"
              />
            </div>
          </div>
        </motion.div>
      ))}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={addOption}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-green-400 text-green-400 rounded-lg hover:bg-green-400 hover:bg-opacity-10 transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Adicionar Opção
      </motion.button>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateSummary}
          className="flex items-center gap-2 px-6 py-3 bg-green-400 text-white rounded-lg hover:bg-green-500 transition-colors font-medium"
        >
          <Sparkles className="w-5 h-5" />
          Gerar Resumo
        </motion.button>
      </div>

      <ResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Árvore de Decisão - Resumo"
        content={
          result && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Decisão</h3>
                <p className="text-text-primary bg-bg-primary p-3 rounded-lg">{result.decision}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Opções ({result.totalOptions})</h3>
                <div className="space-y-3">
                  {result.options.map((opt, i) => (
                    <div key={i} className="bg-bg-primary rounded-lg p-4 border border-gray-700">
                      <h4 className="text-green-400 font-semibold mb-2">Opção {i + 1}: {opt.description}</h4>
                      {opt.consequences && (
                        <p className="text-text-primary text-sm mb-2"><strong>Consequências:</strong> {opt.consequences}</p>
                      )}
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {opt.pros && (
                          <div className="bg-green-500 bg-opacity-20 border border-green-400 rounded p-2">
                            <p className="text-green-400 text-xs font-semibold mb-1">Prós</p>
                            <p className="text-text-primary text-sm">{opt.pros}</p>
                          </div>
                        )}
                        {opt.cons && (
                          <div className="bg-red-500 bg-opacity-20 border border-red-400 rounded p-2">
                            <p className="text-red-400 text-xs font-semibold mb-1">Contras</p>
                            <p className="text-text-primary text-sm">{opt.cons}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }
        onSave={handleSave}
      />
    </div>
  )
}
