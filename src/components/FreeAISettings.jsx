import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react'
import { setApiKey, hasApiKey, callGroq, callGemini } from '../services/aiServiceFree'

export default function FreeAISettings({ isOpen, onClose }) {
  const [groqKey, setGroqKey] = useState('')
  const [geminiKey, setGeminiKey] = useState('')
  const [showGroqKey, setShowGroqKey] = useState(false)
  const [showGeminiKey, setShowGeminiKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(null)
  const [testResult, setTestResult] = useState(null)

  useEffect(() => {
    if (hasApiKey('groq')) {
      setGroqKey('••••••••••••••••')
    }
    if (hasApiKey('gemini')) {
      setGeminiKey('••••••••••••••••')
    }
  }, [])

  const testApiKey = async (provider, key) => {
    try {
      if (provider === 'groq') {
        await callGroq('Teste', 'Você é um assistente útil.')
        return { valid: true, message: 'Groq API key válida!' }
      } else if (provider === 'gemini') {
        await callGemini('Teste', 'Você é um assistente útil.')
        return { valid: true, message: 'Gemini API key válida!' }
      }
    } catch (error) {
      return { 
        valid: false, 
        message: error.message || 'API key inválida' 
      }
    }
  }

  const handleSave = async (provider, key, setKey) => {
    const trimmed = key.trim()
    
    if (trimmed.length < 10) {
      setTestResult({ valid: false, message: 'API key muito curta.' })
      return
    }

    if (trimmed === '••••••••••••••••' && hasApiKey(provider)) {
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
      return
    }

    setTesting(provider)
    setTestResult(null)
    
    const test = await testApiKey(provider, trimmed)
    setTestResult(test)
    setTesting(null)

    if (test.valid) {
      setApiKey(provider, trimmed)
      setKey('••••••••••••••••')
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-text-primary">APIs Gratuitas de IA</h2>
        </div>

        <div className="space-y-6">
          {/* Groq */}
          <div className="bg-bg-primary rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <span className="text-secondary">⚡ Groq</span>
                  <span className="text-xs bg-secondary bg-opacity-20 text-secondary px-2 py-1 rounded">GRATUITO</span>
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  30 req/min, sem limite de tokens • Rápido e gratuito
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showGroqKey ? 'text' : 'password'}
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full px-4 py-3 bg-card border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary pr-10"
                />
                <button
                  onClick={() => setShowGroqKey(!showGroqKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-text-primary"
                >
                  {showGroqKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSave('groq', groqKey, setGroqKey)}
                  disabled={groqKey.trim().length < 10 || testing === 'groq'}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  {testing === 'groq' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Testando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </motion.button>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-secondary hover:underline"
                >
                  Obter chave gratuita →
                </a>
              </div>
            </div>
          </div>

          {/* Gemini */}
          <div className="bg-bg-primary rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <span className="text-blue-400">🤖 Google Gemini</span>
                  <span className="text-xs bg-blue-400 bg-opacity-20 text-blue-400 px-2 py-1 rounded">GRATUITO</span>
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  60 req/min, 1.5M tokens/mês • Modelo avançado
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full px-4 py-3 bg-card border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                />
                <button
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-text-primary"
                >
                  {showGeminiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSave('gemini', geminiKey, setGeminiKey)}
                  disabled={geminiKey.trim().length < 10 || testing === 'gemini'}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  {testing === 'gemini' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Testando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </motion.button>
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline"
                >
                  Obter chave gratuita →
                </a>
              </div>
            </div>
          </div>

          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 p-3 rounded-lg ${
                testResult.valid
                  ? 'bg-secondary bg-opacity-20 border border-secondary'
                  : 'bg-red-500 bg-opacity-20 border border-red-500'
              }`}
            >
              {testResult.valid ? (
                <CheckCircle className="w-5 h-5 text-secondary" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={`text-sm ${testResult.valid ? 'text-secondary' : 'text-red-400'}`}>
                {testResult.message}
              </span>
            </motion.div>
          )}

          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-secondary bg-opacity-20 border border-secondary rounded-lg"
            >
              <CheckCircle className="w-5 h-5 text-secondary" />
              <span className="text-sm text-secondary">API key salva com sucesso!</span>
            </motion.div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-text-primary rounded-lg hover:bg-gray-600 transition-colors"
            >
              Fechar
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

