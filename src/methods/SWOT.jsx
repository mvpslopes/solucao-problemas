import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Plus, Trash2, Sparkles } from 'lucide-react'
import ResultModal from '../components/ResultModal'

export default function SWOT({ onSave, loadedStudy = null }) {
  const [swot, setSwot] = useState({
    strengths: [''],
    weaknesses: [''],
    opportunities: [''],
    threats: ['']
  })
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (loadedStudy && loadedStudy.data) {
      if (loadedStudy.data.swot) {
        setSwot(loadedStudy.data.swot)
      }
    }
  }, [loadedStudy])

  const updateItem = (category, index, value) => {
    setSwot({
      ...swot,
      [category]: swot[category].map((item, i) => i === index ? value : item)
    })
  }

  const addItem = (category) => {
    setSwot({
      ...swot,
      [category]: [...swot[category], '']
    })
  }

  const removeItem = (category, index) => {
    if (swot[category].length > 1) {
      setSwot({
        ...swot,
        [category]: swot[category].filter((_, i) => i !== index)
      })
    }
  }

  const generateSummary = () => {
    const filled = {
      strengths: swot.strengths.filter(s => s.trim() !== ''),
      weaknesses: swot.weaknesses.filter(w => w.trim() !== ''),
      opportunities: swot.opportunities.filter(o => o.trim() !== ''),
      threats: swot.threats.filter(t => t.trim() !== '')
    }

    const total = filled.strengths.length + filled.weaknesses.length + filled.opportunities.length + filled.threats.length

    if (total === 0) {
      alert('Preencha pelo menos um item em qualquer categoria.')
      return
    }

    const summary = {
      swot: filled,
      total,
      analysis: `Análise SWOT\n\n` +
        `FORÇAS (${filled.strengths.length}):\n${filled.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n` +
        `FRAQUEZAS (${filled.weaknesses.length}):\n${filled.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}\n\n` +
        `OPORTUNIDADES (${filled.opportunities.length}):\n${filled.opportunities.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\n` +
        `AMEAÇAS (${filled.threats.length}):\n${filled.threats.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
    }

    setResult(summary)
    setShowResult(true)
  }

  const handleSave = () => {
    if (!result) return

    const study = {
      id: loadedStudy?.id || Date.now().toString(),
      method: 'SWOT',
      title: `Análise SWOT`,
      date: loadedStudy?.date || new Date().toISOString(),
      data: result,
    }

    onSave(study)
    setShowResult(false)
    if (!loadedStudy) {
      setSwot({ strengths: [''], weaknesses: [''], opportunities: [''], threats: [''] })
      setResult(null)
    }
  }

  const renderCategory = (title, category, color, icon) => (
    <div className={`bg-card rounded-xl p-6 border-2 ${color} space-y-4`}>
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${color.replace('border-', 'text-')}`}>{title}</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addItem(category)}
          className={`p-2 ${color.replace('border-', 'bg-').replace('-400', '-400')} bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors`}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
      {swot[category].map((item, index) => (
        <div key={index} className="flex gap-2">
          <textarea
            value={item}
            onChange={(e) => updateItem(category, index, e.target.value)}
            placeholder={`Adicione ${title.toLowerCase()}...`}
            className="flex-1 px-4 py-2 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
            rows="2"
          />
          {swot[category].length > 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => removeItem(category, index)}
              className="p-2 text-red-400 hover:bg-red-400 hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <TrendingUp className="w-8 h-8 text-secondary" />
        <h2 className="text-2xl font-bold text-text-primary">Análise SWOT</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-6 border border-gray-700"
      >
        <p className="text-text-primary mb-2">
          Analise a situação mapeando <strong>Forças</strong> e <strong>Fraquezas</strong> (internas) e <strong>Oportunidades</strong> e <strong>Ameaças</strong> (externas).
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderCategory('Forças', 'strengths', 'border-green-400', Plus)}
        {renderCategory('Fraquezas', 'weaknesses', 'border-red-400', Plus)}
        {renderCategory('Oportunidades', 'opportunities', 'border-blue-400', Plus)}
        {renderCategory('Ameaças', 'threats', 'border-orange-400', Plus)}
      </div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateSummary}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          <Sparkles className="w-5 h-5" />
          Gerar Resumo
        </motion.button>
      </div>

      <ResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Análise SWOT - Resumo"
        content={
          result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500 bg-opacity-20 border border-green-400 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">Forças ({result.swot.strengths.length})</h4>
                  <ul className="space-y-1 text-sm text-text-primary">
                    {result.swot.strengths.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500 bg-opacity-20 border border-red-400 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">Fraquezas ({result.swot.weaknesses.length})</h4>
                  <ul className="space-y-1 text-sm text-text-primary">
                    {result.swot.weaknesses.map((w, i) => (
                      <li key={i}>• {w}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500 bg-opacity-20 border border-blue-400 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">Oportunidades ({result.swot.opportunities.length})</h4>
                  <ul className="space-y-1 text-sm text-text-primary">
                    {result.swot.opportunities.map((o, i) => (
                      <li key={i}>• {o}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-orange-500 bg-opacity-20 border border-orange-400 rounded-lg p-4">
                  <h4 className="text-orange-400 font-semibold mb-2">Ameaças ({result.swot.threats.length})</h4>
                  <ul className="space-y-1 text-sm text-text-primary">
                    {result.swot.threats.map((t, i) => (
                      <li key={i}>• {t}</li>
                    ))}
                  </ul>
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
