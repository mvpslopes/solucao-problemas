import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, Sparkles, Plus, Bot, Settings, Loader2 } from 'lucide-react'
import ResultModal from '../components/ResultModal'
import AIAssistant from '../components/AIAssistant'
import AISettings from '../components/AISettings'
import FreeAISettings from '../components/FreeAISettings'
import AIFollowUpQuestions from '../components/AIFollowUpQuestions'

export default function FiveWhys({ onSave, loadedStudy = null }) {
  const [problem, setProblem] = useState('')
  const [questions, setQuestions] = useState(['']) // Perguntas "Por quê?" editáveis
  const [answers, setAnswers] = useState(['']) // Respostas
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)
  const [showAISettings, setShowAISettings] = useState(false)
  const [showFreeAISettings, setShowFreeAISettings] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [aiSuggestionIndex, setAiSuggestionIndex] = useState(null)

  // Carregar estudo se fornecido
  useEffect(() => {
    if (loadedStudy && loadedStudy.data) {
      setProblem(loadedStudy.data.problem || '')
      if (loadedStudy.data.answers && loadedStudy.data.answers.length > 0) {
        // Adicionar um campo vazio extra para permitir continuar
        setAnswers([...loadedStudy.data.answers, ''])
        // Se houver perguntas salvas, carregar; senão, criar padrão
        if (loadedStudy.data.questions) {
          setQuestions([...loadedStudy.data.questions, ''])
        } else {
          setQuestions(Array(loadedStudy.data.answers.length + 1).fill('').map((_, i) => `Por quê ${i + 1}?`))
        }
      } else {
        setAnswers([''])
        setQuestions(['Por quê 1?'])
      }
    } else {
      // Inicializar com primeira pergunta padrão
      setQuestions(['Por quê 1?'])
    }
  }, [loadedStudy])

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers]
    // Garantir que o array tenha tamanho suficiente
    while (newAnswers.length <= index) {
      newAnswers.push('')
    }
    newAnswers[index] = value
    setAnswers(newAnswers)
    // Limpar sugestão de IA se o usuário editar manualmente
    if (aiSuggestionIndex === index) {
      setAiSuggestion(null)
      setAiSuggestionIndex(null)
    }
  }

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions]
    // Garantir que o array tenha tamanho suficiente
    while (newQuestions.length <= index) {
      newQuestions.push(`Por quê ${index + 1}?`)
    }
    newQuestions[index] = value
    setQuestions(newQuestions)
  }

  const handleAISuggestion = (suggestion, mode) => {
    if (mode === 'suggest-answer' && aiSuggestionIndex !== null) {
      // Aplicar sugestão ao campo atual
      const newAnswers = [...answers]
      newAnswers[aiSuggestionIndex] = suggestion
      setAnswers(newAnswers)
      setAiSuggestion(null)
      setAiSuggestionIndex(null)
    } else {
      // Mostrar sugestão para o usuário aplicar manualmente
      setAiSuggestion(suggestion)
    }
  }

  const handleUseAISuggestion = (index) => {
    setAiSuggestionIndex(index)
  }

  const addMoreWhy = () => {
    const nextIndex = answers.length
    setAnswers([...answers, ''])
    setQuestions([...questions, `Por quê ${nextIndex + 1}?`])
  }

  const generateSummary = () => {
    // Filtrar apenas itens preenchidos (pergunta ou resposta)
    const filledItems = []
    for (let i = 0; i < answers.length; i++) {
      const question = questions[i]?.trim() || `Por quê ${i + 1}?`
      const answer = answers[i]?.trim() || ''
      
      if (answer !== '' || question !== `Por quê ${i + 1}?`) {
        filledItems.push({
          question: question,
          answer: answer
        })
      } else if (filledItems.length > 0) {
        // Se encontrou um vazio depois de ter preenchidos, para
        break
      }
    }

    if (filledItems.length === 0) {
      alert('Por favor, preencha pelo menos o primeiro "Por quê?" e sua resposta')
      return
    }

    const filledAnswers = filledItems.map(item => item.answer).filter(a => a !== '')
    const filledQuestions = filledItems.map(item => item.question)

    const summary = {
      problem,
      questions: filledQuestions,
      answers: filledAnswers,
      rootCause: filledAnswers[filledAnswers.length - 1] || filledItems[filledItems.length - 1].question,
      analysis: `Problema inicial: ${problem}\n\n${filledItems
        .map((item, i) => `${item.question}\nResposta: ${item.answer || '(sem resposta)'}`)
        .join('\n\n')}\n\nCausa raiz identificada: ${filledAnswers[filledAnswers.length - 1] || filledItems[filledItems.length - 1].question}`,
    }

    setResult(summary)
    setShowResult(true)
  }

  const handleSave = () => {
    if (!result) return

    const study = {
      id: loadedStudy?.id || Date.now().toString(),
      method: '5 Porquês',
      title: problem || 'Análise 5 Porquês',
      date: loadedStudy?.date || new Date().toISOString(),
      data: result,
    }

    onSave(study)
    setShowResult(false)
    // Reset form apenas se não for um estudo carregado
    if (!loadedStudy) {
      setProblem('')
      setAnswers([''])
      setQuestions(['Por quê 1?'])
      setResult(null)
    }
  }

  // Determina quantos campos mostrar dinamicamente
  // Sempre mostra pelo menos 1 campo
  // Mostra o próximo campo quando o anterior tem pergunta ou resposta preenchida
  // Permite adicionar quantos campos forem necessários
  const getVisibleCount = () => {
    let count = 1 // Sempre mostra o primeiro campo
    
    // Para cada campo, se o anterior tem conteúdo (pergunta ou resposta), mostra este também
    for (let i = 1; i < Math.max(answers.length, questions.length); i++) {
      const prevQuestion = questions[i - 1]?.trim() || ''
      const prevAnswer = answers[i - 1]?.trim() || ''
      const prevQuestionIsDefault = prevQuestion === `Por quê ${i}?` || prevQuestion === ''
      
      if (prevAnswer !== '' || (!prevQuestionIsDefault && prevQuestion !== '')) {
        count = i + 1
      } else {
        break // Para quando encontrar um campo completamente vazio
      }
    }
    
    return count
  }

  const maxVisible = getVisibleCount()
  const lastIndex = maxVisible - 1
  const canAddMore = maxVisible === Math.max(answers.length, questions.length) && 
                     (answers[lastIndex]?.trim() !== '' || 
                      (questions[lastIndex]?.trim() !== '' && questions[lastIndex] !== `Por quê ${lastIndex + 1}?`))

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <HelpCircle className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-text-primary">Método 5 Porquês</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-text-primary">
            Problema Inicial
          </label>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFreeAISettings(true)}
              className="p-1.5 text-gray-400 hover:text-secondary transition-colors"
              title="APIs Gratuitas (Groq/Gemini)"
            >
              <Sparkles className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAISettings(true)}
              className="p-1.5 text-gray-400 hover:text-primary transition-colors"
              title="OpenAI (Pago)"
            >
              <Settings className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Descreva o problema que você deseja analisar..."
          className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows="3"
        />
      </motion.div>

      {problem.trim().length > 10 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AIAssistant
            problem={problem}
            answers={answers.filter(a => a.trim() !== '')}
            onSuggestionReceived={handleAISuggestion}
            mode="suggest-next"
          />
        </motion.div>
      )}

      <AnimatePresence>
        {Array.from({ length: maxVisible }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-6 border border-gray-700 space-y-4"
          >
            {/* Pergunta "Por quê?" - Editável */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{index + 1}</span>
                  </div>
                  <label className="text-sm font-medium text-gray-400">
                    {index + 1}º Por quê?
                  </label>
                </div>
                {problem.trim().length > 10 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUseAISuggestion(index)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary bg-opacity-20 text-primary rounded-lg hover:bg-opacity-30 transition-colors font-medium"
                  >
                    <Bot className="w-4 h-4" />
                    IA
                  </motion.button>
                )}
              </div>
              <input
                type="text"
                value={questions[index] || `Por quê ${index + 1}?`}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                placeholder={`Digite o ${index + 1}º "Por quê?"...`}
                className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary text-lg font-semibold"
              />
            </div>

            {/* Campo de Resposta */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Resposta:
              </label>
              <textarea
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder={`Digite sua resposta para o ${index + 1}º "Por quê"...`}
                className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows="3"
              />
            </div>

            {/* Assistente de IA para este campo específico */}
            {aiSuggestionIndex === index && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2"
              >
                <AIAssistant
                  problem={problem}
                  answers={answers.slice(0, index).filter(a => a.trim() !== '')}
                  onSuggestionReceived={(suggestion) => {
                    const newAnswers = [...answers]
                    newAnswers[index] = suggestion
                    setAnswers(newAnswers)
                    setAiSuggestionIndex(null)
                  }}
                  mode="suggest-answer"
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {canAddMore && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addMoreWhy}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-primary text-primary rounded-lg hover:bg-primary hover:bg-opacity-10 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Adicionar mais um "Por quê?"
          </motion.button>
        </motion.div>
      )}

      {answers.filter(a => a.trim() !== '').length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <AIAssistant
            problem={problem}
            answers={answers.filter(a => a.trim() !== '')}
            onSuggestionReceived={(suggestion) => {
              setAiSuggestion(suggestion)
            }}
            mode="analyze-root"
          />
          {aiSuggestion && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-4 bg-bg-primary rounded-lg border border-secondary border-opacity-30"
              >
                <h4 className="text-sm font-semibold text-secondary mb-2">Análise da IA sobre a Causa Raiz:</h4>
                <p className="text-text-primary text-sm whitespace-pre-line">{aiSuggestion}</p>
              </motion.div>
              
              {/* Perguntas de follow-up da IA */}
              <AIFollowUpQuestions
                problem={problem}
                currentAnswers={answers.filter(a => a.trim() !== '')}
                currentQuestions={questions.filter((q, i) => {
                  const defaultQ = `Por quê ${i + 1}?`
                  return q && q !== defaultQ && answers[i]?.trim() !== ''
                })}
                onNewQuestionAdded={(question, answer) => {
                  // Adicionar nova pergunta e resposta à análise principal
                  const newIndex = questions.length
                  const newQuestions = [...questions]
                  const newAnswers = [...answers]
                  
                  // Garantir que os arrays tenham tamanho suficiente
                  while (newQuestions.length <= newIndex) {
                    newQuestions.push(`Por quê ${newQuestions.length + 1}?`)
                  }
                  while (newAnswers.length <= newIndex) {
                    newAnswers.push('')
                  }
                  
                  newQuestions[newIndex] = question
                  newAnswers[newIndex] = answer
                  
                  setQuestions(newQuestions)
                  setAnswers(newAnswers)
                }}
                onAnalysisUpdated={(newAnalysis) => {
                  // Atualizar a análise da IA quando houver nova análise
                  setAiSuggestion(newAnalysis)
                }}
                aiAnalysis={aiSuggestion}
              />
            </>
          )}
        </motion.div>
      )}

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateSummary}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
        >
          <Sparkles className="w-5 h-5" />
          Gerar Resumo
        </motion.button>
      </div>

      <AISettings isOpen={showAISettings} onClose={() => setShowAISettings(false)} />
      <FreeAISettings isOpen={showFreeAISettings} onClose={() => setShowFreeAISettings(false)} />

      <ResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Análise 5 Porquês - Resumo"
        content={
          result && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Problema Inicial</h3>
                <p className="text-text-primary bg-bg-primary p-3 rounded-lg">{result.problem}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Cadeia de Porquês</h3>
                <div className="space-y-2">
                  {result.questions && result.questions.length > 0 ? (
                    result.questions.map((question, i) => (
                      <div key={i} className="bg-bg-primary p-3 rounded-lg space-y-1">
                        <div className="text-primary font-medium text-lg">{question}</div>
                        {result.answers[i] && (
                          <div className="text-text-primary ml-4">Resposta: {result.answers[i]}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    result.answers.map((answer, i) => (
                      <div key={i} className="bg-bg-primary p-3 rounded-lg">
                        <span className="text-primary font-medium">Por quê {i + 1}:</span>{' '}
                        <span className="text-text-primary">{answer}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Causa Raiz Identificada</h3>
                <p className="text-secondary font-medium bg-bg-primary p-3 rounded-lg border-l-4 border-secondary">
                  {result.rootCause}
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

