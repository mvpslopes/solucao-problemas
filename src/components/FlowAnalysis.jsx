import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

export default function FlowAnalysis({ study }) {
  if (!study || !study.data) return null

  const { problem, answers, rootCause } = study.data

  // Análise do fluxo
  const analysis = {
    hasProblem: !!problem && problem.trim().length > 10,
    problemQuality: problem?.trim().length > 10 ? 'good' : problem?.trim().length > 0 ? 'fair' : 'poor',
    answersCount: answers?.length || 0,
    answersQuality: [],
    hasRootCause: !!rootCause && rootCause.trim().length > 0,
    flowContinuity: true, // Verificar se há continuidade lógica
  }

  // Avaliar qualidade de cada resposta
  if (answers && answers.length > 0) {
    answers.forEach((answer, index) => {
      const length = answer.trim().length
      let quality = 'poor'
      if (length > 50) quality = 'good'
      else if (length > 20) quality = 'fair'
      
      analysis.answersQuality.push({
        index: index + 1,
        answer,
        quality,
        length,
      })
    })
  }

  // Verificar continuidade lógica (se cada resposta se relaciona com a anterior)
  let continuityIssues = []
  if (answers && answers.length > 1) {
    for (let i = 1; i < answers.length; i++) {
      const prev = answers[i - 1].toLowerCase()
      const curr = answers[i].toLowerCase()
      
      // Verificações básicas de continuidade
      if (prev.length < 10 || curr.length < 10) {
        continuityIssues.push({
          between: `${i} e ${i + 1}`,
          issue: 'Respostas muito curtas podem indicar falta de profundidade',
        })
      }
    }
  }

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'good': return 'text-secondary'
      case 'fair': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getQualityIcon = (quality) => {
    switch (quality) {
      case 'good': return <CheckCircle className="w-5 h-5 text-secondary" />
      case 'fair': return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case 'poor': return <AlertCircle className="w-5 h-5 text-red-400" />
      default: return <Info className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-6 border border-gray-700 space-y-4"
    >
      <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
        <Info className="w-6 h-6 text-primary" />
        Análise do Fluxo
      </h3>

      {/* Problema */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {analysis.hasProblem ? (
            <CheckCircle className="w-5 h-5 text-secondary" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span className="font-semibold text-text-primary">Problema Inicial</span>
        </div>
        <p className={`text-sm ${getQualityColor(analysis.problemQuality)} ml-7`}>
          {analysis.hasProblem
            ? `✓ Problema bem definido (${problem.trim().length} caracteres)`
            : '⚠ Problema muito curto ou não definido'}
        </p>
      </div>

      {/* Quantidade de Porquês */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {analysis.answersCount >= 3 ? (
            <CheckCircle className="w-5 h-5 text-secondary" />
          ) : analysis.answersCount > 0 ? (
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span className="font-semibold text-text-primary">Cadeia de Porquês</span>
        </div>
        <p className={`text-sm ${analysis.answersCount >= 3 ? 'text-secondary' : analysis.answersCount > 0 ? 'text-yellow-400' : 'text-red-400'} ml-7`}>
          {analysis.answersCount === 0
            ? '⚠ Nenhuma resposta registrada'
            : analysis.answersCount < 3
            ? `⚠ Apenas ${analysis.answersCount} resposta(s). Recomenda-se pelo menos 3-5 para uma análise mais profunda.`
            : `✓ ${analysis.answersCount} resposta(s) - boa profundidade na análise`}
        </p>
      </div>

      {/* Qualidade das Respostas */}
      {analysis.answersQuality.length > 0 && (
        <div className="space-y-2">
          <span className="font-semibold text-text-primary">Qualidade das Respostas</span>
          <div className="space-y-2 ml-4">
            {analysis.answersQuality.map((item) => (
              <div key={item.index} className="flex items-start gap-2">
                {getQualityIcon(item.quality)}
                <div className="flex-1">
                  <span className="text-sm text-text-primary">
                    <span className="font-medium">Por quê {item.index}:</span>{' '}
                    <span className={getQualityColor(item.quality)}>
                      {item.quality === 'good'
                        ? '✓ Resposta detalhada'
                        : item.quality === 'fair'
                        ? '⚠ Resposta razoável'
                        : '⚠ Resposta muito curta'}
                      {' '}({item.length} caracteres)
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Causa Raiz */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {analysis.hasRootCause ? (
            <CheckCircle className="w-5 h-5 text-secondary" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span className="font-semibold text-text-primary">Causa Raiz Identificada</span>
        </div>
        <p className={`text-sm ${analysis.hasRootCause ? 'text-secondary' : 'text-red-400'} ml-7`}>
          {analysis.hasRootCause
            ? '✓ Causa raiz identificada'
            : '⚠ Causa raiz não identificada claramente'}
        </p>
      </div>

      {/* Recomendações */}
      <div className="mt-4 p-4 bg-bg-primary rounded-lg border border-gray-700">
        <h4 className="font-semibold text-text-primary mb-2">Recomendações:</h4>
        <ul className="space-y-1 text-sm text-gray-400">
          {analysis.answersCount < 3 && (
            <li>• Considere adicionar mais "Porquês" para uma análise mais profunda</li>
          )}
          {analysis.answersQuality.some(a => a.quality === 'poor') && (
            <li>• Tente elaborar mais nas respostas dos "Porquês" para maior clareza</li>
          )}
          {!analysis.hasRootCause && (
            <li>• Certifique-se de que a última resposta identifica claramente a causa raiz</li>
          )}
          {analysis.answersCount >= 5 && (
            <li>• ✓ Excelente! Você fez uma análise muito profunda</li>
          )}
        </ul>
      </div>
    </motion.div>
  )
}

