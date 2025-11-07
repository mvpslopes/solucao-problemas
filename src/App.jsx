import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import History from './pages/History'
import About from './pages/About'
import Toast from './components/Toast'

function HomeWrapper({ onSaveStudy }) {
  const [searchParams] = useSearchParams()
  const [loadedStudy, setLoadedStudy] = useState(null)

  useEffect(() => {
    const loadId = searchParams.get('load')
    if (loadId) {
      const saved = localStorage.getItem('resolvai_studies')
      if (saved) {
        try {
          const studies = JSON.parse(saved)
          const study = studies.find(s => s.id === loadId)
          if (study) {
            setLoadedStudy(study)
            // Limpar parâmetro da URL
            window.history.replaceState({}, '', '/')
          }
        } catch (e) {
          console.error('Erro ao carregar estudo:', e)
        }
      }
    } else {
      // Tentar carregar do localStorage (caso tenha sido salvo diretamente)
      const savedStudy = localStorage.getItem('resolvai_loaded_study')
      if (savedStudy) {
        try {
          setLoadedStudy(JSON.parse(savedStudy))
          localStorage.removeItem('resolvai_loaded_study')
        } catch (e) {
          console.error('Erro ao carregar estudo:', e)
        }
      }
    }
  }, [searchParams])

  return <Home onSaveStudy={onSaveStudy} loadedStudy={loadedStudy} />
}

function App() {
  const [toast, setToast] = useState({ message: '', isVisible: false })

  useEffect(() => {
    // Sempre aplicar modo escuro
    document.documentElement.classList.add('dark')
    document.body.style.backgroundColor = '#0F172A'
    document.body.style.color = '#F1F5F9'
  }, [])

  const handleSaveStudy = (study) => {
    const saved = localStorage.getItem('resolvai_studies')
    let studies = []
    
    if (saved) {
      try {
        studies = JSON.parse(saved)
      } catch (e) {
        console.error('Erro ao carregar estudos:', e)
      }
    }
    
    // Verificar se é uma atualização de estudo existente
    const existingIndex = studies.findIndex(s => s.id === study.id)
    if (existingIndex !== -1) {
      // Atualizar estudo existente
      studies[existingIndex] = { ...study, date: new Date().toISOString() }
      setToast({ message: 'Análise atualizada com sucesso!', isVisible: true })
    } else {
      // Adicionar novo estudo
      studies.push(study)
      setToast({ message: 'Estudo salvo com sucesso!', isVisible: true })
    }
    
    localStorage.setItem('resolvai_studies', JSON.stringify(studies))
    
    // Disparar evento customizado para atualizar a página History
    window.dispatchEvent(new CustomEvent('studySaved'))
    
    setTimeout(() => {
      setToast({ message: '', isVisible: false })
    }, 3000)
  }

  return (
    <Router>
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeWrapper onSaveStudy={handleSaveStudy} />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Toast
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={() => setToast({ message: '', isVisible: false })}
        />
      </div>
    </Router>
  )
}

export default App

