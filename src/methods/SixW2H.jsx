import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Sparkles } from 'lucide-react'
import ResultModal from '../components/ResultModal'

export default function SixW2H({ onSave, loadedStudy = null }) {
  const [answers, setAnswers] = useState({
    what: '',
    why: '',
    where: '',
    when: '',
    who: '',
    which: '',
    how: '',
    howMuch: ''
  })
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (loadedStudy && loadedStudy.data) {
      if (loadedStudy.data.answers) {
        setAnswers(loadedStudy.data.answers)
      }
    }
  }, [loadedStudy])

  const updateAnswer = (key, value) => {
    setAnswers({
      ...answers,
      [key]: value
    })
  }

  const generateSummary = () => {
    const filledCount = Object.values(answers).filter(a => a.trim() !== '').length

    if (filledCount === 0) {
      alert('Preencha pelo menos uma pergunta para gerar o resumo.')
      return
    }

    const labels = {
      what: 'O quê?',
      why: 'Por quê?',
      where: 'Onde?',
      when: 'Quando?',
      who: 'Quem?',
      which: 'Qual?',
      how: 'Como?',
      howMuch: 'Quanto?'
    }

    const summary = {
      answers,
      filledCount,
      analysis: `Análise 6W2H\n\n` +
        Object.entries(answers)
          .filter(([_, value]) => value.trim() !== '')
          .map(([key, value]) => `${labels[key]}\n${value}`)
          .join('\n\n')
    }

    setResult(summary)
    setShowResult(true)
  }

  const handleSave = () => {
    if (!result) return

    const study = {
      id: loadedStudy?.id || Date.now().toString(),
      method: '6W2H',
      title: 'Análise 6W2H',
      date: loadedStudy?.date || new Date().toISOString(),
      data: result,
    }

    onSave(study)
    setShowResult(false)
    if (!loadedStudy) {
      setAnswers({
        what: '', why: '', where: '', when: '',
        who: '', which: '', how: '', howMuch: ''
      })
      setResult(null)
    }
  }

  const questions = [
    { key: 'what', label: 'O quê?', placeholder: 'O que precisa ser feito?', icon: '📋' },
    { key: 'why', label: 'Por quê?', placeholder: 'Por que isso é necessário?', icon: '❓' },
    { key: 'where', label: 'Onde?', placeholder: 'Onde será realizado?', icon: '📍' },
    { key: 'when', label: 'Quando?', placeholder: 'Quando será realizado?', icon: '📅' },
    { key: 'who', label: 'Quem?', placeholder: 'Quem será responsável?', icon: '👤' },
    { key: 'which', label: 'Qual?', placeholder: 'Qual recurso/ferramenta será usado?', icon: '🔧' },
    { key: 'how', label: 'Como?', placeholder: 'Como será realizado?', icon: '⚙️' },
    { key: 'howMuch', label: 'Quanto?', placeholder: 'Quanto custa? Qual o orçamento?', icon: '💰' }
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <FileText className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-bold text-text-primary">Método 6W2H</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-6 border border-gray-700"
      >
        <p className="text-text-primary">
          Mapeie todos os aspectos de um problema ou projeto respondendo às 8 perguntas fundamentais.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((q, index) => (
          <motion.div
            key={q.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-6 border border-gray-700"
          >
            <label className="block text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
              <span className="text-2xl">{q.icon}</span>
              {q.label}
            </label>
            <textarea
              value={answers[q.key]}
              onChange={(e) => updateAnswer(q.key, e.target.value)}
              placeholder={q.placeholder}
              className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows="3"
            />
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateSummary}
          className="flex items-center gap-2 px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
        >
          <Sparkles className="w-5 h-5" />
          Gerar Resumo
        </motion.button>
      </div>

      <ResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Análise 6W2H - Resumo"
        content={
          result && (
            <div className="space-y-4">
              {Object.entries(result.answers)
                .filter(([_, value]) => value.trim() !== '')
                .map(([key, value]) => {
                  const labels = {
                    what: 'O quê?', why: 'Por quê?', where: 'Onde?', when: 'Quando?',
                    who: 'Quem?', which: 'Qual?', how: 'Como?', howMuch: 'Quanto?'
                  }
                  return (
                    <div key={key} className="bg-bg-primary rounded-lg p-4 border border-gray-700">
                      <h4 className="text-blue-400 font-semibold mb-2">{labels[key]}</h4>
                      <p className="text-text-primary">{value}</p>
                    </div>
                  )
                })}
            </div>
          )
        }
        onSave={handleSave}
      />
    </div>
  )
}
