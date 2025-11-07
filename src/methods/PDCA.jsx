import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Plus, Sparkles, Circle } from 'lucide-react'
import ResultModal from '../components/ResultModal'

export default function PDCA({ onSave, loadedStudy = null }) {
  const [cycles, setCycles] = useState([{
    id: Date.now(),
    plan: '',
    do: '',
    check: '',
    act: '',
    date: new Date().toISOString()
  }])
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (loadedStudy && loadedStudy.data) {
      if (loadedStudy.data.cycles) {
        setCycles(loadedStudy.data.cycles)
      }
    }
  }, [loadedStudy])

  const addCycle = () => {
    setCycles([...cycles, {
      id: Date.now(),
      plan: '',
      do: '',
      check: '',
      act: '',
      date: new Date().toISOString()
    }])
    setCurrentCycleIndex(cycles.length)
  }

  const updateCycle = (field, value) => {
    const updated = [...cycles]
    updated[currentCycleIndex] = {
      ...updated[currentCycleIndex],
      [field]: value
    }
    setCycles(updated)
  }

  const generateSummary = () => {
    const filledCycles = cycles.filter(c => 
      c.plan.trim() !== '' || c.do.trim() !== '' || c.check.trim() !== '' || c.act.trim() !== ''
    )

    if (filledCycles.length === 0) {
      alert('Preencha pelo menos uma fase do ciclo PDCA.')
      return
    }

    const summary = {
      cycles: filledCycles,
      totalCycles: filledCycles.length,
      analysis: `Ciclo PDCA - ${filledCycles.length} ciclo(s)\n\n` +
        filledCycles.map((cycle, i) => 
          `CICLO ${i + 1}:\n` +
          `PLANEJAR: ${cycle.plan || '(não preenchido)'}\n` +
          `FAZER: ${cycle.do || '(não preenchido)'}\n` +
          `VERIFICAR: ${cycle.check || '(não preenchido)'}\n` +
          `AGIR: ${cycle.act || '(não preenchido)'}\n`
        ).join('\n')
    }

    setResult(summary)
    setShowResult(true)
  }

  const handleSave = () => {
    if (!result) return

    const study = {
      id: loadedStudy?.id || Date.now().toString(),
      method: 'PDCA',
      title: `Ciclo PDCA - ${result.totalCycles} ciclo(s)`,
      date: loadedStudy?.date || new Date().toISOString(),
      data: result,
    }

    onSave(study)
    setShowResult(false)
    if (!loadedStudy) {
      setCycles([{ id: Date.now(), plan: '', do: '', check: '', act: '', date: new Date().toISOString() }])
      setCurrentCycleIndex(0)
      setResult(null)
    }
  }

  const currentCycle = cycles[currentCycleIndex]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <RefreshCw className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-text-primary">Ciclo PDCA</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-6 border border-gray-700"
      >
        <p className="text-text-primary mb-4">
          Implemente melhorias contínuas através do ciclo <strong>PDCA</strong>:
        </p>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="text-center p-3 bg-blue-500 bg-opacity-20 rounded-lg border border-blue-400">
            <div className="font-semibold text-blue-400">P - PLANEJAR</div>
            <div className="text-gray-400 text-xs mt-1">Definir objetivo e plano</div>
          </div>
          <div className="text-center p-3 bg-green-500 bg-opacity-20 rounded-lg border border-green-400">
            <div className="font-semibold text-green-400">D - FAZER</div>
            <div className="text-gray-400 text-xs mt-1">Executar o plano</div>
          </div>
          <div className="text-center p-3 bg-yellow-500 bg-opacity-20 rounded-lg border border-yellow-400">
            <div className="font-semibold text-yellow-400">C - VERIFICAR</div>
            <div className="text-gray-400 text-xs mt-1">Analisar resultados</div>
          </div>
          <div className="text-center p-3 bg-purple-500 bg-opacity-20 rounded-lg border border-purple-400">
            <div className="font-semibold text-purple-400">A - AGIR</div>
            <div className="text-gray-400 text-xs mt-1">Padronizar ou ajustar</div>
          </div>
        </div>
      </motion.div>

      {cycles.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {cycles.map((cycle, index) => (
            <motion.button
              key={cycle.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentCycleIndex(index)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentCycleIndex === index
                  ? 'bg-yellow-400 text-white'
                  : 'bg-card border border-gray-700 text-text-primary hover:bg-opacity-80'
              }`}
            >
              Ciclo {index + 1}
            </motion.button>
          ))}
        </div>
      )}

      <div className="bg-card rounded-xl p-6 border border-gray-700 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Ciclo {currentCycleIndex + 1}</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addCycle}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 bg-opacity-20 text-yellow-400 rounded-lg hover:bg-opacity-30 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Ciclo
          </motion.button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
              <Circle className="w-4 h-4" />
              PLANEJAR (P)
            </label>
            <textarea
              value={currentCycle.plan}
              onChange={(e) => updateCycle('plan', e.target.value)}
              placeholder="Defina o objetivo e o plano de ação..."
              className="w-full px-4 py-3 bg-bg-primary border border-blue-400 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
              <Circle className="w-4 h-4" />
              FAZER (D)
            </label>
            <textarea
              value={currentCycle.do}
              onChange={(e) => updateCycle('do', e.target.value)}
              placeholder="Execute o plano e registre o que foi feito..."
              className="w-full px-4 py-3 bg-bg-primary border border-green-400 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-400 mb-2 flex items-center gap-2">
              <Circle className="w-4 h-4" />
              VERIFICAR (C)
            </label>
            <textarea
              value={currentCycle.check}
              onChange={(e) => updateCycle('check', e.target.value)}
              placeholder="Analise os resultados obtidos..."
              className="w-full px-4 py-3 bg-bg-primary border border-yellow-400 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
              <Circle className="w-4 h-4" />
              AGIR (A)
            </label>
            <textarea
              value={currentCycle.act}
              onChange={(e) => updateCycle('act', e.target.value)}
              placeholder="Padronize o que funcionou ou ajuste o que não funcionou..."
              className="w-full px-4 py-3 bg-bg-primary border border-purple-400 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              rows="3"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateSummary}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors font-medium"
        >
          <Sparkles className="w-5 h-5" />
          Gerar Resumo
        </motion.button>
      </div>

      <ResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Ciclo PDCA - Resumo"
        content={
          result && (
            <div className="space-y-4">
              {result.cycles.map((cycle, i) => (
                <div key={i} className="bg-bg-primary rounded-lg p-4 border border-gray-700">
                  <h4 className="text-lg font-semibold text-text-primary mb-3">Ciclo {i + 1}</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-blue-400 font-medium">PLANEJAR:</span>
                      <p className="text-text-primary mt-1">{cycle.plan || '(não preenchido)'}</p>
                    </div>
                    <div>
                      <span className="text-green-400 font-medium">FAZER:</span>
                      <p className="text-text-primary mt-1">{cycle.do || '(não preenchido)'}</p>
                    </div>
                    <div>
                      <span className="text-yellow-400 font-medium">VERIFICAR:</span>
                      <p className="text-text-primary mt-1">{cycle.check || '(não preenchido)'}</p>
                    </div>
                    <div>
                      <span className="text-purple-400 font-medium">AGIR:</span>
                      <p className="text-text-primary mt-1">{cycle.act || '(não preenchido)'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
        onSave={handleSave}
      />
    </div>
  )
}
