import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, Plus, Loader2 } from 'lucide-react'
import { analyzeRootCauseFree, hasApiKey as hasFreeApiKey } from '../services/aiServiceFree'
import { analyzeRootCause as analyzeRootCauseOpenAI, hasApiKey } from '../services/aiService'

export default function AIFollowUpQuestions({ 
  problem, 
  currentAnswers, 
  currentQuestions,
  onNewQuestionAdded,
  aiAnalysis,
  onAnalysisUpdated
}) {
  const [suggestedQuestions, setSuggestedQuestions] = useState([])
  const [questionAnswers, setQuestionAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [followUpAnalysis, setFollowUpAnalysis] = useState(null)

  // Extrair perguntas sugeridas da análise da IA
  const extractQuestions = (analysis) => {
    if (!analysis) return []
    
    const questions = []
    const lines = analysis.split('\n')
    let inQuestionSection = false
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Detectar seção de perguntas
      if (trimmed.toLowerCase().includes('pergunta') || 
          trimmed.toLowerCase().includes('questão') ||
          trimmed.toLowerCase().includes('sugestão')) {
        inQuestionSection = true
      }
      
      // Procurar por linhas que terminam com "?"
      if (trimmed.endsWith('?') && trimmed.length > 15) {
        // Remover prefixos comuns
        let question = trimmed
          .replace(/^[-•*]\s*/, '') // Remove marcadores de lista
          .replace(/^\d+[\.\)]\s*/, '') // Remove numeração
          .replace(/^(pergunta|questão):\s*/i, '') // Remove prefixo "Pergunta:"
          .trim()
        
        if (question.length > 15 && !questions.includes(question)) {
          questions.push(question)
        }
      }
      
      // Procurar por padrões como "Pergunta:", "Questão:", etc.
      if (trimmed.toLowerCase().includes('pergunta:') || trimmed.toLowerCase().includes('questão:')) {
        const question = trimmed.split(':').slice(1).join(':').trim()
        if (question.endsWith('?') && question.length > 15 && !questions.includes(question)) {
          questions.push(question)
        }
      }
    }
    
    // Se não encontrou perguntas explícitas, procurar no final do texto
    if (questions.length === 0) {
      const lastLines = lines.slice(-5) // Últimas 5 linhas
      for (const line of lastLines) {
        const trimmed = line.trim()
        if (trimmed.endsWith('?') && trimmed.length > 15) {
          const question = trimmed.replace(/^[-•*]\s*/, '').trim()
          if (!questions.includes(question)) {
            questions.push(question)
          }
        }
      }
    }
    
    return questions.slice(0, 3) // Máximo de 3 perguntas
  }

  // Quando a análise da IA mudar, extrair perguntas
  useEffect(() => {
    if (aiAnalysis) {
      const questions = extractQuestions(aiAnalysis)
      if (questions.length > 0) {
        setSuggestedQuestions(questions)
        // Inicializar respostas vazias
        const initialAnswers = {}
        questions.forEach((q, i) => {
          initialAnswers[i] = ''
        })
        setQuestionAnswers(initialAnswers)
      }
    }
  }, [aiAnalysis])

  const handleAnswerChange = (questionIndex, answer) => {
    setQuestionAnswers({
      ...questionAnswers,
      [questionIndex]: answer
    })
  }

  const handleAddQuestion = (question) => {
    if (onNewQuestionAdded) {
      onNewQuestionAdded(question, questionAnswers[suggestedQuestions.indexOf(question)] || '')
    }
  }

  const handleContinueAnalysis = async () => {
    const answeredQuestions = suggestedQuestions
      .map((q, i) => ({
        question: q,
        answer: questionAnswers[i] || ''
      }))
      .filter(item => item.answer.trim() !== '')

    if (answeredQuestions.length === 0) {
      setError('Responda pelo menos uma pergunta para continuar a análise.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Adicionar as perguntas e respostas à análise principal
      answeredQuestions.forEach((item) => {
        if (onNewQuestionAdded) {
          onNewQuestionAdded(item.question, item.answer)
        }
      })

      // Combinar respostas anteriores com novas respostas para análise
      const allAnswers = [...currentAnswers, ...answeredQuestions.map(item => item.answer)]

      // Continuar análise com todas as informações
      let newAnalysis
      if (hasFreeApiKey('groq') || hasFreeApiKey('gemini')) {
        newAnalysis = await analyzeRootCauseFree(
          problem, 
          allAnswers,
          hasFreeApiKey('groq') ? 'groq' : 'gemini'
        )
      } else if (hasApiKey()) {
        newAnalysis = await analyzeRootCauseOpenAI(problem, allAnswers)
      } else {
        throw new Error('Nenhuma API configurada')
      }

      setFollowUpAnalysis(newAnalysis)
      
      // Notificar o componente pai sobre a análise atualizada
      if (onAnalysisUpdated) {
        onAnalysisUpdated(newAnalysis)
      }
      
      // Extrair novas perguntas da análise atualizada
      const newQuestions = extractQuestions(newAnalysis)
      if (newQuestions.length > 0) {
        setSuggestedQuestions(newQuestions)
        const initialAnswers = {}
        newQuestions.forEach((q, i) => {
          initialAnswers[i] = ''
        })
        setQuestionAnswers(initialAnswers)
      } else {
        // Se não há mais perguntas, limpar
        setSuggestedQuestions([])
      }
    } catch (err) {
      setError(err.message || 'Erro ao continuar análise')
    } finally {
      setLoading(false)
    }
  }

  if (suggestedQuestions.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-6 border border-primary border-opacity-30 space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h4 className="text-lg font-semibold text-text-primary">
          Perguntas Sugeridas pela IA
        </h4>
      </div>

      <p className="text-sm text-gray-400 mb-4">
        A IA sugeriu estas perguntas para aprofundar a análise. Responda-as para continuar:
      </p>

      <div className="space-y-4">
        {suggestedQuestions.map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-bg-primary rounded-lg p-4 border border-gray-700 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-primary font-medium mb-2">{question}</div>
                <textarea
                  value={questionAnswers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Digite sua resposta aqui..."
                  className="w-full px-3 py-2 bg-card border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                  rows="2"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddQuestion(question)}
                disabled={!questionAnswers[index] || questionAnswers[index].trim() === ''}
                className="ml-3 p-2 bg-primary bg-opacity-20 text-primary rounded-lg hover:bg-opacity-30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Adicionar à análise"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-sm text-red-400"
        >
          {error}
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleContinueAnalysis}
        disabled={loading || Object.values(questionAnswers).every(a => !a || a.trim() === '')}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analisando...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Continuar Análise com Respostas
          </>
        )}
      </motion.button>

      {followUpAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-bg-primary rounded-lg border border-secondary border-opacity-30"
        >
          <h5 className="text-sm font-semibold text-secondary mb-2">Análise Atualizada:</h5>
          <p className="text-text-primary text-sm whitespace-pre-line">{followUpAnalysis}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

