import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Sparkles, CheckCircle, XCircle } from 'lucide-react'
import ResultModal from '../components/ResultModal'

export default function SMART({ onSave, loadedStudy = null }) {
  const [objective, setObjective] = useState('')
  const [criteria, setCriteria] = useState({
    specific: { value: '', checked: false },
    measurable: { value: '', checked: false },
    achievable: { value: '', checked: false },
    relevant: { value: '', checked: false },
    timeBound: { value: '', checked: false }
  })
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (loadedStudy && loadedStudy.data) {
      if (loadedStudy.data.objective) {
        setObjective(loadedStudy.data.objective)
      }
      if (loadedStudy.data.criteria) {
        setCriteria(loadedStudy.data.criteria)
      }
    }
  }, [loadedStudy])

  const updateCriterion = (key, field, value) => {
    setCriteria({
      ...criteria,
      [key]: {
        ...criteria[key],
        [field]: field === 'checked' ? value : value
      }
    })
  }

  const generateSummary = () => {
    if (!objective.trim()) {
      alert('Defina um objetivo antes de gerar o resumo.')
      return
    }

    const checkedCount = Object.values(criteria).filter(c => c.checked).length
    const isSmart = checkedCount === 5

    const summary = {
      objective,
      criteria,
      isSmart,
      score: checkedCount,
      analysis: `Objetivo: ${objective}\n\n` +
        `Avaliação SMART:\n` +
        `${criteria.specific.checked ? '✓' : '✗'} Específico: ${criteria.specific.value || '(não avaliado)'}\n` +
        `${criteria.measurable.checked ? '✓' : '✗'} Mensurável: ${criteria.measurable.value || '(não avaliado)'}\n` +
        `${criteria.achievable.checked ? '✓' : '✗'} Alcançável: ${criteria.achievable.value || '(não avaliado)'}\n` +
        `${criteria.relevant.checked ? '✓' : '✗'} Relevante: ${criteria.relevant.value || '(não avaliado)'}\n` +
        `${criteria.timeBound.checked ? '✓' : '✗'} Temporal: ${criteria.timeBound.value || '(não avaliado)'}\n\n` +
        `Pontuação: ${checkedCount}/5\n` +
        `Status: ${isSmart ? 'Objetivo SMART ✓' : 'Objetivo precisa de ajustes'}`
    }

    setResult(summary)
    setShowResult(true)
  }

  const handleSave = () => {
    if (!result) return

    const study = {
      id: loadedStudy?.id || Date.now().toString(),
      method: 'SMART',
      title: objective || 'Objetivo SMART',
      date: loadedStudy?.date || new Date().toISOString(),
      data: result,
    }

    onSave(study)
    setShowResult(false)
    if (!loadedStudy) {
      setObjective('')
      setCriteria({
        specific: { value: '', checked: false },
        measurable: { value: '', checked: false },
        achievable: { value: '', checked: false },
        relevant: { value: '', checked: false },
        timeBound: { value: '', checked: false }
      })
      setResult(null)
    }
  }

  const renderCriterion = (key, label, description, icon) => {
    const criterion = criteria[key]
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card rounded-xl p-6 border border-gray-700 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{label}</h3>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={criterion.checked}
              onChange={(e) => updateCriterion(key, 'checked', e.target.checked)}
              className="w-5 h-5 text-purple-400 rounded focus:ring-purple-400"
            />
            {criterion.checked ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-gray-600" />
            )}
          </div>
        </div>
        <textarea
          value={criterion.value}
          onChange={(e) => updateCriterion(key, 'value', e.target.value)}
          placeholder={`Explique como o objetivo atende ao critério "${label}"...`}
          className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          rows="3"
        />
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <CheckSquare className="w-8 h-8 text-purple-400" />
        <h2 className="text-2xl font-bold text-text-primary">Método SMART</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-6 border border-gray-700"
      >
        <label className="block text-sm font-medium text-text-primary mb-2">
          Objetivo
        </label>
        <textarea
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="Defina seu objetivo aqui..."
          className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          rows="3"
        />
        <p className="text-sm text-gray-400 mt-2">
          Avalie se seu objetivo atende aos 5 critérios SMART abaixo.
        </p>
      </motion.div>

      <div className="space-y-4">
        {renderCriterion('specific', 'S - Específico', 'O objetivo é claro e bem definido?', <span className="text-purple-400 font-bold">S</span>)}
        {renderCriterion('measurable', 'M - Mensurável', 'É possível medir o progresso e o resultado?', <span className="text-purple-400 font-bold">M</span>)}
        {renderCriterion('achievable', 'A - Alcançável', 'O objetivo é realista e possível de alcançar?', <span className="text-purple-400 font-bold">A</span>)}
        {renderCriterion('relevant', 'R - Relevante', 'O objetivo é importante e relevante para você?', <span className="text-purple-400 font-bold">R</span>)}
        {renderCriterion('timeBound', 'T - Temporal', 'Há um prazo definido para alcançar o objetivo?', <span className="text-purple-400 font-bold">T</span>)}
      </div>

      <div className="bg-card rounded-xl p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Pontuação SMART</p>
            <p className="text-2xl font-bold text-purple-400">
              {Object.values(criteria).filter(c => c.checked).length}/5
            </p>
          </div>
          {Object.values(criteria).filter(c => c.checked).length === 5 && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">Objetivo SMART!</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateSummary}
          className="flex items-center gap-2 px-6 py-3 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition-colors font-medium"
        >
          <Sparkles className="w-5 h-5" />
          Gerar Resumo
        </motion.button>
      </div>

      <ResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Objetivo SMART - Resumo"
        content={
          result && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Objetivo</h3>
                <p className="text-text-primary bg-bg-primary p-3 rounded-lg">{result.objective}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Avaliação SMART</h3>
                <div className="space-y-2">
                  {Object.entries(result.criteria).map(([key, criterion]) => {
                    const labels = {
                      specific: 'Específico',
                      measurable: 'Mensurável',
                      achievable: 'Alcançável',
                      relevant: 'Relevante',
                      timeBound: 'Temporal'
                    }
                    return (
                      <div key={key} className="bg-bg-primary p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          {criterion.checked ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                          <span className="font-medium text-text-primary">{labels[key]}</span>
                        </div>
                        {criterion.value && (
                          <p className="text-sm text-gray-400 ml-7">{criterion.value}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className={`p-4 rounded-lg ${result.isSmart ? 'bg-green-500 bg-opacity-20 border border-green-400' : 'bg-yellow-500 bg-opacity-20 border border-yellow-400'}`}>
                <p className={`font-semibold ${result.isSmart ? 'text-green-400' : 'text-yellow-400'}`}>
                  {result.isSmart ? '✓ Objetivo SMART!' : `Pontuação: ${result.score}/5 - Ajuste os critérios não atendidos`}
                </p>
              </div>
            </div>
          )
        }
        onSave={handleSave}
      />
    </div>
  )
}
