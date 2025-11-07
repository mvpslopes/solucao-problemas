import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { suggestNextWhy, analyzeRootCause, suggestAnswer, hasApiKey } from '../services/aiService'
import { suggestNextWhyFree, analyzeRootCauseFree, suggestAnswerFree, hasApiKey as hasFreeApiKey } from '../services/aiServiceFree'
import QuotaError from './QuotaError'

export default function AIAssistant({ 
  problem, 
  answers, 
  onSuggestionReceived,
  mode = 'suggest-next' // 'suggest-next', 'suggest-answer', 'analyze-root'
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [suggestion, setSuggestion] = useState(null)

  const handleSuggestion = async () => {
    // Verificar se tem alguma API configurada (gratuita ou paga)
    const hasAnyKey = hasApiKey() || hasFreeApiKey('groq') || hasFreeApiKey('gemini')
    
    if (!hasAnyKey) {
      setError('Nenhuma API configurada. Configure uma API gratuita (Groq ou Gemini) em Configurações > IA Gratuita.')
      return
    }

    if (!problem || problem.trim().length < 10) {
      setError('Por favor, descreva o problema inicial antes de usar a IA.')
      return
    }

    setLoading(true)
    setError(null)
    setSuggestion(null)

    try {
      const filledAnswers = answers.filter(a => a.trim() !== '')
      let result

      // Tentar usar API gratuita primeiro, depois OpenAI
      try {
        if (mode === 'suggest-next') {
          if (hasFreeApiKey('groq') || hasFreeApiKey('gemini')) {
            result = await suggestNextWhyFree(problem, filledAnswers, hasFreeApiKey('groq') ? 'groq' : 'gemini')
          } else {
            result = await suggestNextWhy(problem, filledAnswers)
          }
        } else if (mode === 'suggest-answer') {
          const currentIndex = filledAnswers.length
          const currentQuestion = `Por quê ${currentIndex + 1}?`
          if (hasFreeApiKey('groq') || hasFreeApiKey('gemini')) {
            result = await suggestAnswerFree(problem, filledAnswers, currentQuestion, hasFreeApiKey('groq') ? 'groq' : 'gemini')
          } else {
            result = await suggestAnswer(problem, filledAnswers, currentQuestion)
          }
        } else if (mode === 'analyze-root') {
          if (filledAnswers.length < 2) {
            throw new Error('Preencha pelo menos 2 "Porquês" antes de analisar a causa raiz.')
          }
          if (hasFreeApiKey('groq') || hasFreeApiKey('gemini')) {
            result = await analyzeRootCauseFree(problem, filledAnswers, hasFreeApiKey('groq') ? 'groq' : 'gemini')
          } else {
            result = await analyzeRootCause(problem, filledAnswers)
          }
        }
      } catch (freeError) {
        // Se API gratuita falhar, tentar OpenAI como fallback
        if (hasApiKey()) {
          if (mode === 'suggest-next') {
            result = await suggestNextWhy(problem, filledAnswers)
          } else if (mode === 'suggest-answer') {
            const currentIndex = filledAnswers.length
            result = await suggestAnswer(problem, filledAnswers, `Por quê ${currentIndex + 1}?`)
          } else if (mode === 'analyze-root') {
            result = await analyzeRootCause(problem, filledAnswers)
          }
        } else {
          throw freeError
        }
      }

      setSuggestion(result)
      if (onSuggestionReceived) {
        onSuggestionReceived(result, mode)
      }
    } catch (err) {
      let errorMessage = err.message || 'Erro ao consultar a IA. Verifique sua conexão e API key.'
      
      // Melhorar mensagens de erro específicas
      if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
        errorMessage = '❌ Cota da API excedida. Configure uma API gratuita (Groq ou Gemini) em Configurações > IA Gratuita.'
      } else if (errorMessage.includes('429')) {
        errorMessage = '⏱️ Muitas requisições. Configure Groq (gratuito) em Configurações > IA Gratuita.'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getButtonText = () => {
    switch (mode) {
      case 'suggest-next':
        return 'Sugerir próximo "Por quê?"'
      case 'suggest-answer':
        return 'Sugerir resposta'
      case 'analyze-root':
        return 'Analisar causa raiz'
      default:
        return 'Pedir ajuda da IA'
    }
  }

  return (
    <div className="bg-card rounded-xl p-4 border border-primary border-opacity-30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-text-primary">Assistente de IA</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSuggestion}
          disabled={loading || !hasApiKey()}
          className="px-4 py-2 bg-primary bg-opacity-20 text-primary rounded-lg hover:bg-opacity-30 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {getButtonText()}
            </>
          )}
        </motion.button>
      </div>

      {error && (
        <>
          {error.includes('quota') || error.includes('billing') || error.includes('Cota') ? (
            <QuotaError onDismiss={() => setError(null)} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-3 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg text-sm"
            >
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-400">{error}</p>
            </motion.div>
          )}
        </>
      )}

      {suggestion && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-bg-primary rounded-lg border border-primary border-opacity-20"
        >
          <div className="flex items-start gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
            <span className="text-xs font-medium text-secondary">Sugestão da IA:</span>
          </div>
          <p className="text-text-primary text-sm whitespace-pre-line">{suggestion}</p>
        </motion.div>
      )}

      {!hasApiKey() && (
        <div className="mt-3 p-3 bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-30 rounded-lg text-sm">
          <p className="text-yellow-400">
            ⚠ Configure sua API key da OpenAI em Configurações para usar o assistente de IA.
          </p>
        </div>
      )}
    </div>
  )
}

