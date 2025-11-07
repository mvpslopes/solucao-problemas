import { motion } from 'framer-motion'
import { Sparkles, Target, Zap } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Sobre o ResolvAI</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-8 border border-gray-700 mb-6"
        >
          <p className="text-text-primary text-lg leading-relaxed mb-4">
            O <span className="text-primary font-semibold">ResolvAI</span> é um laboratório
            pessoal de pensamento estruturado e tomada de decisão, inspirado em métodos clássicos
            de gestão e raciocínio lógico.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Nossa missão é fornecer ferramentas práticas que ajudem você a analisar problemas de
            forma sistemática, tomar decisões mais informadas e desenvolver habilidades de
            raciocínio crítico.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-6 border border-gray-700"
          >
            <Sparkles className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Métodos Comprovados
            </h3>
            <p className="text-gray-400 text-sm">
              Utilize técnicas validadas por décadas de uso em gestão e análise de problemas.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl p-6 border border-gray-700"
          >
            <Target className="w-8 h-8 text-secondary mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Análise Estruturada
            </h3>
            <p className="text-gray-400 text-sm">
              Organize seus pensamentos e chegue a conclusões mais claras e fundamentadas.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl p-6 border border-gray-700"
          >
            <Zap className="w-8 h-8 text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Histórico Persistente
            </h3>
            <p className="text-gray-400 text-sm">
              Salve suas análises e consulte-as sempre que precisar revisar decisões passadas.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-xl font-semibold text-text-primary mb-4">Recursos Futuros</h2>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Exportação de relatórios em PDF</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>IA que sugere o método ideal conforme o problema</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Sistema de login e sincronização na nuvem</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Histórico categorizado por tema (trabalho, pessoal, estudo)</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}

