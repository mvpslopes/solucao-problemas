import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Eye, Calendar, FileText, Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ResultModal from '../components/ResultModal'
import FlowAnalysis from '../components/FlowAnalysis'

export default function History() {
  const [studies, setStudies] = useState([])
  const [selectedStudy, setSelectedStudy] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadStudies()
    
    // Recarregar estudos quando um novo estudo for salvo
    const handleStudySaved = () => {
      loadStudies()
    }
    
    // Recarregar estudos quando a página receber foco (útil quando volta da página de métodos)
    const handleFocus = () => {
      loadStudies()
    }
    
    // Também recarrega quando o storage muda (útil para múltiplas abas)
    const handleStorageChange = (e) => {
      if (e.key === 'resolvai_studies') {
        loadStudies()
      }
    }
    
    window.addEventListener('studySaved', handleStudySaved)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('studySaved', handleStudySaved)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const loadStudies = () => {
    const saved = localStorage.getItem('resolvai_studies')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setStudies(parsed.sort((a, b) => new Date(b.date) - new Date(a.date)))
      } catch (e) {
        console.error('Erro ao carregar estudos:', e)
      }
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este estudo?')) {
      const updated = studies.filter((s) => s.id !== id)
      localStorage.setItem('resolvai_studies', JSON.stringify(updated))
      setStudies(updated)
    }
  }

  const handleView = (study) => {
    setSelectedStudy(study)
    setShowModal(true)
  }

  const handleEdit = (study) => {
    // Salvar estudo no localStorage para carregar na Home
    localStorage.setItem('resolvai_loaded_study', JSON.stringify(study))
    // Navegar para home com parâmetro
    navigate('/?load=' + study.id)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Histórico</h1>
          <p className="text-gray-400 text-lg">
            Visualize e gerencie seus estudos anteriores
          </p>
        </div>

        {studies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl p-12 border border-gray-700 text-center"
          >
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-text-primary text-lg mb-2">Nenhum estudo salvo ainda</p>
            <p className="text-gray-400">
              Comece a usar os métodos de resolução de problemas para ver seus estudos aqui
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {studies.map((study) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-card rounded-xl p-6 border border-gray-700 hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-primary mb-1">
                        {study.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(study.date)}</span>
                      </div>
                      <span className="inline-block px-2 py-1 bg-primary bg-opacity-20 text-primary text-xs rounded">
                        {study.method}
                      </span>
                    </div>
                  </div>

                  {study.data?.problem && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {study.data.problem}
                    </p>
                  )}

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleView(study)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary bg-opacity-20 text-primary rounded-lg hover:bg-opacity-30 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(study.id)}
                        className="p-2 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-opacity-30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                    {study.method === '5 Porquês' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(study)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary bg-opacity-20 text-secondary rounded-lg hover:bg-opacity-30 transition-colors text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        Continuar/Editar
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      <ResultModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedStudy(null)
        }}
        title={selectedStudy?.title || 'Detalhes do Estudo'}
        content={
          selectedStudy && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Método</h3>
                <p className="text-text-primary">{selectedStudy.method}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Data</h3>
                <p className="text-text-primary">{formatDate(selectedStudy.date)}</p>
              </div>
              {selectedStudy.data && (
                <>
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    {selectedStudy.data.problem && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Problema</h3>
                        <p className="text-text-primary bg-bg-primary p-3 rounded-lg">
                          {selectedStudy.data.problem}
                        </p>
                      </div>
                    )}
                  {selectedStudy.data.answers && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Análise</h3>
                      <div className="space-y-2">
                        {selectedStudy.data.questions && selectedStudy.data.questions.length > 0 ? (
                          selectedStudy.data.questions.map((question, i) => (
                            <div key={i} className="bg-bg-primary p-3 rounded-lg space-y-1">
                              <div className="text-primary font-medium">{question}</div>
                              {selectedStudy.data.answers[i] && (
                                <div className="text-text-primary ml-4">Resposta: {selectedStudy.data.answers[i]}</div>
                              )}
                            </div>
                          ))
                        ) : (
                          selectedStudy.data.answers.map((answer, i) => (
                            <div key={i} className="bg-bg-primary p-3 rounded-lg">
                              <span className="text-primary font-medium">Por quê {i + 1}:</span>{' '}
                              <span className="text-text-primary">{answer}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                    {selectedStudy.data.rootCause && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Causa Raiz</h3>
                        <p className="text-secondary font-medium bg-bg-primary p-3 rounded-lg border-l-4 border-secondary">
                          {selectedStudy.data.rootCause}
                        </p>
                      </div>
                    )}
                  </div>
                  {selectedStudy.method === '5 Porquês' && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <FlowAnalysis study={selectedStudy} />
                    </div>
                  )}
                </>
              )}
            </div>
          )
        }
      />
    </div>
  )
}

