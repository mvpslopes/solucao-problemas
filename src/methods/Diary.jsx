import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Save, Calendar } from 'lucide-react'
import ResultModal from '../components/ResultModal'

export default function Diary({ onSave, loadedStudy = null }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (loadedStudy && loadedStudy.data) {
      if (loadedStudy.data.title) {
        setTitle(loadedStudy.data.title)
      }
      if (loadedStudy.data.content) {
        setContent(loadedStudy.data.content)
      }
      if (loadedStudy.data.tags) {
        setTags(loadedStudy.data.tags)
      }
    }
  }, [loadedStudy])

  const generateSummary = () => {
    if (!content.trim()) {
      alert('Escreva algo antes de salvar.')
      return
    }

    const tagList = tags.split(',').map(t => t.trim()).filter(t => t !== '')

    const summary = {
      title: title || 'Entrada de Diário',
      content,
      tags: tagList,
      date: new Date().toISOString(),
      analysis: `${title || 'Entrada de Diário'}\n\n${content}${tagList.length > 0 ? `\n\nTags: ${tagList.join(', ')}` : ''}`
    }

    setResult(summary)
    setShowResult(true)
  }

  const handleSave = () => {
    if (!result) return

    const study = {
      id: loadedStudy?.id || Date.now().toString(),
      method: 'Diário',
      title: result.title,
      date: loadedStudy?.date || new Date().toISOString(),
      data: result,
    }

    onSave(study)
    setShowResult(false)
    if (!loadedStudy) {
      setTitle('')
      setContent('')
      setTags('')
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
        <BookOpen className="w-8 h-8 text-pink-400" />
        <h2 className="text-2xl font-bold text-text-primary">Diário</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-6 border border-gray-700 space-y-4"
      >
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Título (opcional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Dê um título à sua reflexão..."
            className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Reflexão
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva suas reflexões, aprendizados, insights ou pensamentos aqui..."
            className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
            rows="12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Tags (opcional, separadas por vírgula)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="ex: trabalho, aprendizado, pessoal"
            className="w-full px-4 py-3 bg-bg-primary border border-gray-700 rounded-lg text-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>
      </motion.div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateSummary}
          className="flex items-center gap-2 px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors font-medium"
        >
          <Save className="w-5 h-5" />
          Salvar Entrada
        </motion.button>
      </div>

      <ResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        title="Diário - Visualização"
        content={
          result && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{result.title}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(result.date).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="bg-bg-primary rounded-lg p-4 border border-gray-700">
                <p className="text-text-primary whitespace-pre-line">{result.content}</p>
              </div>
              {result.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-pink-400 bg-opacity-20 text-pink-400 rounded-full text-sm">
                        {tag}
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
