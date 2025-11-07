/**
 * Serviço de IA com suporte para APIs gratuitas
 * Suporta: Groq (gratuito), Google Gemini (gratuito), Hugging Face
 */

const API_ENDPOINTS = {
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  huggingface: 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
}

/**
 * Obtém a API key do localStorage ou env
 */
function getApiKey(provider) {
  // Mapear nomes de providers para variáveis de ambiente
  const envMap = {
    'groq': 'VITE_GROQ_API_KEY',
    'gemini': 'VITE_GEMINI_API_KEY',
  }
  
  const envKey = envMap[provider] || `VITE_${provider.toUpperCase()}_API_KEY`
  const key = localStorage.getItem(`resolvai_${provider}_key`) || 
              import.meta.env[envKey]
  return key
}

/**
 * Configura a API key de um provedor
 */
export function setApiKey(provider, key) {
  localStorage.setItem(`resolvai_${provider}_key`, key)
}

/**
 * Verifica se há uma API key configurada
 */
export function hasApiKey(provider) {
  return !!getApiKey(provider)
}

/**
 * Groq API - GRATUITO e RÁPIDO
 * Obtenha sua chave em: https://console.groq.com/keys
 * Plano gratuito: 30 requisições/minuto, sem limite de tokens
 */
export async function callGroq(prompt, systemMessage = null) {
  const apiKey = getApiKey('groq')
  if (!apiKey) {
    throw new Error('Groq API key não configurada. Obtenha em: https://console.groq.com/keys')
  }

  const messages = []
  if (systemMessage) {
    messages.push({ role: 'system', content: systemMessage })
  }
  messages.push({ role: 'user', content: prompt })

  try {
    const response = await fetch(API_ENDPOINTS.groq, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Modelo rápido e gratuito
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Erro ao chamar Groq API')
    }

    const data = await response.json()
    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Erro ao chamar Groq:', error)
    throw error
  }
}

/**
 * Google Gemini API - GRATUITO
 * Obtenha sua chave em: https://makersuite.google.com/app/apikey
 * Plano gratuito: 60 requisições/minuto, 1.5M tokens/mês
 */
export async function callGemini(prompt, systemMessage = null) {
  const apiKey = getApiKey('gemini')
  if (!apiKey) {
    throw new Error('Gemini API key não configurada. Obtenha em: https://makersuite.google.com/app/apikey')
  }

  const fullPrompt = systemMessage 
    ? `${systemMessage}\n\n${prompt}`
    : prompt

  try {
    const url = `${API_ENDPOINTS.gemini}?key=${apiKey}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }]
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Erro ao chamar Gemini API')
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text.trim()
  } catch (error) {
    console.error('Erro ao chamar Gemini:', error)
    throw error
  }
}

/**
 * Função unificada que tenta usar APIs gratuitas primeiro
 */
export async function callFreeAI(prompt, systemMessage = null, preferredProvider = 'groq') {
  // Ordem de tentativa: Groq -> Gemini -> OpenAI (se configurado)
  const providers = [preferredProvider, 'gemini', 'openai']
  
  for (const provider of providers) {
    try {
      if (provider === 'groq' && hasApiKey('groq')) {
        return await callGroq(prompt, systemMessage)
      } else if (provider === 'gemini' && hasApiKey('gemini')) {
        return await callGemini(prompt, systemMessage)
      } else if (provider === 'openai') {
        // Fallback para OpenAI se configurado
        const { suggestNextWhy } = await import('./aiService.js')
        // Adaptar para usar OpenAI se disponível
        return null // Por enquanto, não usar OpenAI como fallback
      }
    } catch (error) {
      console.log(`Erro com ${provider}, tentando próximo...`, error.message)
      continue
    }
  }
  
  throw new Error('Nenhuma API configurada. Configure Groq (gratuito) ou Gemini (gratuito)')
}

/**
 * Sugere próximo "Por quê?" usando API gratuita
 */
export async function suggestNextWhyFree(problem, previousAnswers, provider = 'groq') {
  const context = previousAnswers.length > 0
    ? `Respostas anteriores:\n${previousAnswers.map((a, i) => `Por quê ${i + 1}: ${a}`).join('\n')}`
    : 'Esta é a primeira pergunta "Por quê?".'

  const prompt = `Você é um especialista em análise de causa raiz usando o método 5 Porquês.

Problema inicial: ${problem}

${context}

Sugira o próximo "Por quê?" que deve ser feito para continuar a investigação da causa raiz. 
A resposta deve ser uma pergunta direta e específica que aprofunde a investigação.
Responda APENAS com a pergunta, sem explicações adicionais.`

  const systemMessage = 'Você é um especialista em análise de causa raiz. Seja direto e objetivo nas respostas.'

  return await callFreeAI(prompt, systemMessage, provider)
}

/**
 * Analisa causa raiz usando API gratuita
 */
export async function analyzeRootCauseFree(problem, answers, provider = 'groq', includeQuestions = true) {
  const chain = answers.map((a, i) => `Por quê ${i + 1}: ${a}`).join('\n')

  const questionsInstruction = includeQuestions 
    ? `4. Se a análise precisar de mais profundidade, sugira 2-3 perguntas específicas que o usuário deve responder para continuar a investigação. Formate as perguntas de forma clara, uma por linha, começando com "Pergunta:" ou apenas listando-as.`
    : ''

  const prompt = `Você é um especialista em análise de causa raiz usando o método 5 Porquês.

Problema inicial: ${problem}

Cadeia de Porquês:
${chain}

Analise esta cadeia de "Porquês" e:
1. Identifique a causa raiz mais provável
2. Avalie se a análise está completa ou se precisa de mais profundidade
3. Sugira melhorias se necessário
${questionsInstruction}

Responda de forma clara e estruturada, destacando a causa raiz identificada.${includeQuestions ? ' Se precisar de mais informações, termine sua resposta com perguntas específicas que o usuário deve responder.' : ''}`

  const systemMessage = 'Você é um especialista em análise de causa raiz. Forneça análises detalhadas e úteis.'

  return await callFreeAI(prompt, systemMessage, provider)
}

/**
 * Sugere resposta usando API gratuita
 */
export async function suggestAnswerFree(problem, previousAnswers, currentWhyQuestion, provider = 'groq') {
  const context = previousAnswers.length > 0
    ? `Respostas anteriores:\n${previousAnswers.map((a, i) => `Por quê ${i + 1}: ${a}`).join('\n')}`
    : 'Esta é a primeira pergunta "Por quê?".'

  const prompt = `Você é um especialista em análise de causa raiz usando o método 5 Porquês.

Problema inicial: ${problem}

${context}

Pergunta atual: ${currentWhyQuestion}

Sugira uma resposta objetiva e específica para esta pergunta que aprofunde a investigação da causa raiz.
A resposta deve ser clara, direta e focada na causa, não no sintoma.`

  const systemMessage = 'Você é um especialista em análise de causa raiz. Seja direto e objetivo nas respostas.'

  return await callFreeAI(prompt, systemMessage, provider)
}

