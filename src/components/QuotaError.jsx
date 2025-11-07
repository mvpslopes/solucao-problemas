import { motion } from 'framer-motion'
import { AlertTriangle, ExternalLink, CreditCard } from 'lucide-react'

export default function QuotaError({ onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-50 rounded-lg p-4 mb-4"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-yellow-400 mb-2">
            Cota da API Excedida
          </h4>
          <p className="text-sm text-yellow-300 mb-3">
            Sua conta OpenAI não tem créditos suficientes ou excedeu o limite de uso.
          </p>
          <div className="flex flex-col gap-2">
            <motion.a
              href="https://platform.openai.com/account/billing"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-500 bg-opacity-30 hover:bg-opacity-40 rounded-lg text-sm text-yellow-200 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Adicionar Créditos
              <ExternalLink className="w-3 h-3" />
            </motion.a>
            <motion.a
              href="https://platform.openai.com/usage"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm text-yellow-300 transition-colors"
            >
              Verificar Uso
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="mt-3 text-xs text-yellow-400 hover:text-yellow-300 underline"
            >
              Fechar este aviso
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

