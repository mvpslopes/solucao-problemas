import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Plus, Trash2, Sparkles, Tag } from 'lucide-react'
import ResultModal from '../components/ResultModal'

export default function Brainstorm({ onSave, loadedStudy = null }) {
  const [topic, setTopic] = useState('')
  const [ideas, setIdeas] = useState([{ id: Date.now(), text: '', category: '' }])
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (loadedStudy && loadedStudy.data) {
      if (loadedStudy.data.topic) {
        setTopic(loadedStudy.data.topic)
      }
      if (loadedStudy.data.ideas) {
        setIdeas(loadedStudy.data.ideas)
      }
    }
  }, [loadedStudy])

  const addIdea = () => {
    setIdeas([...ideas, { id: Date.now(), text: '', category: '' }])
  }

  const removeIdea = (id) => {
    setIdeas(ideas.filter(i => i.id !== id))
  }

  const updateIdea = (id, field, value) => {
    setIdeas(ideas.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const generateSummary = () => {
    const filledIdeas = ideas.filter(i => i.text.trim() !== '')

    if (filledIdeas.length === 0) {
      alert('Adicione pelo menos uma ideia para gerar o resumo.')
      return
    }

    const categories = [...new Set(filledIdeas.map(i => i.category).filter(c => c.trim() !== ''))]

    const summary = {
      topic: topic || 'Brainstorm',
      ideas: filledIdeas,
      totalIdeas: filledIdeas.length,
      categories,
      analysis: `Brainstorm${topic ? `: ${topic}` : ''}\n\n` +
        `Total de ideias: ${filledIdeas.length}\n\n` +
        (categories.length > 0 ? `Categorias: ${categories.join(', ')}\n\n` : '') +
        filledIdeas.map((idea, i) => 
          `${i + 1}. ${idea.text}${idea.category ? ` [${idea.category}]` : ''}`
        ).join('\n')
    }

    setResult(summary)
    setShowResult(true)
  }

  const handleSave = () => {
    if (!result) return

    const study = {
      id: loadedStudy?.id || Date.now().toString(),
      method: 'Brainstorm',
      title: topic || 'Brainstorm',
      date: loadedStudy?.date || new Date().toISOString(),
      data: result,
    }

    onSave(study)
    setShowResult(false)
    if (!loadedStudy) {
      setTopic('')
      setIdeas([{ id: Date.now(), text: '', category: '' }])
      setResult(null)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <Lightbulb className="w-8 h-8 text-orange-400" />
        <h2 className="text-2xl font-bold text-text-primary">Brainstorm</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-6 border border-gray-700"
      >
        <label className="block text-sm font-medium text-text-primary mb-2">
          Tema/Problema
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Sobre o que você quer fazer brainstorm?"
          className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <p className="text-sm text-gray-400 mt-2">
          Gere e organize ideias livremente. Não se preocupe com qualidade inicialmente - apenas anote tudo que vier à mente!
        </p>
      </motion.div>

      {ideas.map((idea, index) => (
        <motion.div
          key={idea.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-card rounded-xl p-6 border border-gray-700 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-orange-400">Ideia {index + 1}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => removeIdea(idea.id)}
              className="p-2 text-red-400 hover:bg-red-400 hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
          <textarea
            value={idea.text}
            onChange={(e) => updateIdea(idea.id, 'text', e.target.value)}
            placeholder="Digite sua ideia aqui..."
            className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            rows="2"
          />
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={idea.category}
              onChange={(e) => updateIdea(idea.id, 'category', e.target.value)}
              placeholder="Categoria (opcional)"
              className="flex-1 px-3 py-2 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>
        </motion.div>
      ))}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={addIdea}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-orange-400 text-orange-400 rounded-lg hover:bg-orange-400 hover:bg-opacity-10 transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Adicionar Ideia
      </motion.button>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateSummary}
          className="flex items-center gap-2 px-6 py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors font-medium"
        >
          <Sparkles className="w-5 h-5" />
          Gerar Resumo
        </motion.button>
      </div>

      <ResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Brainstorm - Resumo"
        content={
          result && (
            <div className="space-y-4">
              {result.topic && (
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Tema</h3>
                  <p className="text-text-primary bg-bg-primary p-3 rounded-lg">{result.topic}</p>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Ideias ({result.totalIdeas})
                </h3>
                <div className="space-y-2">
                  {result.ideas.map((idea, i) => (
                    <div key={i} className="bg-bg-primary p-3 rounded-lg border border-gray-700">
                      <div className="flex items-start justify-between">
                        <p className="text-text-primary flex-1">{idea.text}</p>
                        {idea.category && (
                          <span className="ml-2 px-2 py-1 bg-orange-400 bg-opacity-20 text-orange-400 text-xs rounded">
                            {idea.category}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {result.categories.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Categorias</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.categories.map((cat, i) => (
                      <span key={i} className="px-3 py-1 bg-orange-400 bg-opacity-20 text-orange-400 rounded-full text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        }
        onSave={handleSave}
      />
    </div>
  )
}
