// Utilitário para visualizar estudos salvos no console
export function viewStudiesInConsole() {
  const saved = localStorage.getItem('resolvai_studies')
  if (saved) {
    try {
      const studies = JSON.parse(saved)
      console.log('=== ESTUDOS SALVOS ===')
      studies.forEach((study, index) => {
        console.log(`\n--- Estudo ${index + 1} ---`)
        console.log('ID:', study.id)
        console.log('Título:', study.title)
        console.log('Método:', study.method)
        console.log('Data:', new Date(study.date).toLocaleString('pt-BR'))
        if (study.data) {
          console.log('\nDados da Análise:')
          if (study.data.problem) {
            console.log('Problema:', study.data.problem)
          }
          if (study.data.answers) {
            console.log('\nRespostas dos "Porquês":')
            study.data.answers.forEach((answer, i) => {
              console.log(`  Por quê ${i + 1}:`, answer)
            })
          }
          if (study.data.rootCause) {
            console.log('\nCausa Raiz:', study.data.rootCause)
          }
        }
        console.log('\n' + '='.repeat(50))
      })
      return studies
    } catch (e) {
      console.error('Erro ao ler estudos:', e)
      return null
    }
  } else {
    console.log('Nenhum estudo salvo ainda.')
    return null
  }
}

