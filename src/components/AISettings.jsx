import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { setApiKey, hasApiKey } from '../services/aiService'

export default function AISettings({ isOpen, onClose }) {
  const [apiKey, setApiKeyValue] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  useEffect(() => {
    // Carregar key existente (apenas mostrar se já existe)
    if (hasApiKey()) {
      setApiKeyValue('••••••••••••••••')
    }
  }, [])

  const validateApiKey = (key) => {
    // Validação básica: deve começar com sk- e ter pelo menos 20 caracteres
    const trimmed = key.trim()
    return trimmed.startsWith('sk-') && trimmed.length >= 20
  }

  const testApiKey = async (key) => {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key.trim()}`,
        },
      })

      if (response.ok) {
        return { valid: true, message: 'API key válida!' }
      } else {
        const error = await response.json()
        return { 
          valid: false, 
          message: error.error?.message || 'API key inválida' 
        }
      }
    } catch (error) {
      return { 
        valid: false, 
        message: 'Erro ao testar API key. Verifique sua conexão.' 
      }
    }
  }

  const handleSave = async () => {
    const trimmed = apiKey.trim()
    
    if (!validateApiKey(trimmed)) {
      setTestResult({ valid: false, message: 'API key inválida. Deve começar com "sk-" e ter pelo menos 20 caracteres.' })
      return
    }

    // Se a key já estava salva e o usuário não mudou, apenas salvar
    if (trimmed === '••••••••••••••••' && hasApiKey()) {
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        onClose()
      }, 1500)
      return
    }

    // Testar a API key antes de salvar
    setTesting(true)
    setTestResult(null)
    
    const test = await testApiKey(trimmed)
    setTestResult(test)
    setTesting(false)

    if (test.valid) {
      setApiKey(trimmed)
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        onClose()
      }, 1500)
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
        className="bg-card rounded-xl p-6 max-w-md w-full border border-gray-700"
      >
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-text-primary">Configurações de IA</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKeyValue(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary pr-10"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-text-primary"
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Sua API key é armazenada localmente no navegador. Obtenha uma em{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                platform.openai.com
              </a>
            </p>
          </div>

          {testing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-primary bg-opacity-20 border border-primary rounded-lg"
            >
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-sm text-primary">Testando API key...</span>
            </motion.div>
          )}

          {testResult && !testResult.valid && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg"
            >
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-400 font-medium">Erro ao validar API key</p>
                <p className="text-xs text-red-300 mt-1">{testResult.message}</p>
              </div>
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

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-text-primary rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={apiKey.trim().length < 10 || testing}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Testando...
                </>
              ) : (
                'Salvar e Testar'
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

