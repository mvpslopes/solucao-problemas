/**
 * Utilitário para debug e visualização dos dados da API OpenAI
 * Use no console do navegador para testar e ver os dados retornados
 */

import { suggestNextWhy, analyzeRootCause, suggestAnswer, hasApiKey } from '../services/aiService'

/**
 * Testa a API e mostra todos os dados retornados no console
 */
export async function testOpenAIAPI() {
  console.log('=== TESTE DA API OPENAI ===\n')
  
  if (!hasApiKey()) {
    console.error('❌ API Key não configurada!')
    console.log('Configure em: Configurações > IA ou via .env')
    return
  }

  console.log('✅ API Key encontrada\n')

  // Exemplo de teste
  const testProblem = 'O site está lento para carregar'
  const testAnswers = [
    'O servidor está sobrecarregado',
    'Há muitos usuários acessando simultaneamente'
  ]

  console.log('📝 Testando com:')
  console.log('Problema:', testProblem)
  console.log('Respostas anteriores:', testAnswers)
  console.log('\n')

  try {
    console.log('🔄 Chamando API...\n')
    
    // Teste 1: Sugerir próximo "Por quê?"
    console.log('--- TESTE 1: Sugerir próximo "Por quê?" ---')
    const nextWhy = await suggestNextWhy(testProblem, testAnswers)
    console.log('✅ Resposta recebida:', nextWhy)
    console.log('\n')

    // Teste 2: Analisar causa raiz
    console.log('--- TESTE 2: Analisar causa raiz ---')
    const rootCause = await analyzeRootCause(testProblem, testAnswers)
    console.log('✅ Análise recebida:', rootCause)
    console.log('\n')

    // Teste 3: Sugerir resposta
    console.log('--- TESTE 3: Sugerir resposta ---')
    const suggestion = await suggestAnswer(testProblem, testAnswers, 'Por quê 3?')
    console.log('✅ Sugestão recebida:', suggestion)
    console.log('\n')

    console.log('✅ Todos os testes concluídos com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao chamar API:', error)
    console.error('Detalhes:', error.message)
  }
}

/**
 * Faz uma chamada direta à API e mostra a resposta completa
 */
export async function callOpenAIDirectly(prompt, showFullResponse = true) {
  const apiKey = localStorage.getItem('resolvai_openai_key') || import.meta.env.VITE_OPENAI_API_KEY
  
  if (!apiKey) {
    console.error('❌ API Key não encontrada!')
    return null
  }

  console.log('📤 Enviando requisição...')
  console.log('Prompt:', prompt)
  console.log('\n')

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente útil.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    console.log('📥 Status da resposta:', response.status, response.statusText)
    console.log('\n')

    const data = await response.json()

    if (showFullResponse) {
      console.log('📋 RESPOSTA COMPLETA DA API:')
      console.log(JSON.stringify(data, null, 2))
      console.log('\n')
    }

    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message.content
      console.log('💬 Conteúdo da resposta:')
      console.log(content)
      console.log('\n')
      
      console.log('📊 Metadados:')
      console.log('- Modelo usado:', data.model)
      console.log('- Tokens usados:', data.usage?.total_tokens)
      console.log('- Tokens de prompt:', data.usage?.prompt_tokens)
      console.log('- Tokens de resposta:', data.usage?.completion_tokens)
    }

    return data
  } catch (error) {
    console.error('❌ Erro:', error)
    return null
  }
}

// Disponibilizar no window para uso no console
if (typeof window !== 'undefined') {
  window.testOpenAIAPI = testOpenAIAPI
  window.callOpenAIDirectly = callOpenAIDirectly
  console.log('🔧 Utilitários de debug carregados!')
  console.log('Use: testOpenAIAPI() ou callOpenAIDirectly("seu prompt aqui")')
}

