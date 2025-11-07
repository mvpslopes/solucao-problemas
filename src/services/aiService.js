/**
 * Serviço de IA para ajudar na análise de causa raiz
 * Suporta OpenAI API e pode ser estendido para outras APIs
 */

const API_ENDPOINTS = {
  openai: 'https://api.openai.com/v1/chat/completions',
  // Pode adicionar outros endpoints aqui
}

/**
 * Obtém a API key do ambiente ou localStorage
 */
function getApiKey() {
  // Primeiro tenta variável de ambiente (Vite usa import.meta.env)
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    return import.meta.env.VITE_OPENAI_API_KEY
  }
  
  // Depois tenta localStorage (para configuração manual)
  return localStorage.getItem('resolvai_openai_key')
}

/**
 * Configura a API key manualmente
 */
export function setApiKey(key) {
  localStorage.setItem('resolvai_openai_key', key)
}

/**
 * Verifica se há uma API key configurada
 */
export function hasApiKey() {
  return !!getApiKey()
}

/**
 * Sugere o próximo "Por quê?" baseado no problema e respostas anteriores
 */
export async function suggestNextWhy(problem, previousAnswers) {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('API key não configurada. Configure em Configurações > IA.')
  }

  const context = previousAnswers.length > 0
    ? `Respostas anteriores:\n${previousAnswers.map((a, i) => `Por quê ${i + 1}: ${a}`).join('\n')}`
    : 'Esta é a primeira pergunta "Por quê?".'

  const prompt = `Você é um especialista em análise de causa raiz usando o método 5 Porquês.

Problema inicial: ${problem}

${context}

Sugira o próximo "Por quê?" que deve ser feito para continuar a investigação da causa raiz. 
A resposta deve ser uma pergunta direta e específica que aprofunde a investigação.
Responda APENAS com a pergunta, sem explicações adicionais.`

  try {
    const response = await fetch(API_ENDPOINTS.openai, {
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
            content: 'Você é um especialista em análise de causa raiz. Seja direto e objetivo nas respostas.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      let errorMessage = error.error?.message || 'Erro ao chamar API da OpenAI'
      
      // Mensagens de erro mais amigáveis
      if (response.status === 429) {
        if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
          errorMessage = 'Cota excedida. Verifique seus créditos e plano de faturamento em: https://platform.openai.com/account/billing'
        } else {
          errorMessage = 'Muitas requisições. Aguarde alguns minutos e tente novamente.'
        }
      } else if (response.status === 401) {
        errorMessage = 'API key inválida ou expirada. Verifique suas configurações.'
      } else if (response.status === 403) {
        errorMessage = 'Acesso negado. Verifique as permissões da sua API key.'
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    
    // Log completo em desenvolvimento (pode ser removido em produção)
    if (import.meta.env.DEV) {
      console.log('📋 Resposta completa da API:', data)
      console.log('💬 Conteúdo extraído:', data.choices[0].message.content)
      console.log('📊 Uso de tokens:', data.usage)
    }
    
    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Erro ao chamar IA:', error)
    throw error
  }
}

/**
 * Analisa todas as respostas e sugere a causa raiz
 */
export async function analyzeRootCause(problem, answers) {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('API key não configurada. Configure em Configurações > IA.')
  }

  const chain = answers.map((a, i) => `Por quê ${i + 1}: ${a}`).join('\n')

  const prompt = `Você é um especialista em análise de causa raiz usando o método 5 Porquês.

Problema inicial: ${problem}

Cadeia de Porquês:
${chain}

Analise esta cadeia de "Porquês" e:
1. Identifique a causa raiz mais provável
2. Avalie se a análise está completa ou se precisa de mais profundidade
3. Sugira melhorias se necessário
4. Se a análise precisar de mais profundidade, sugira 2-3 perguntas específicas que o usuário deve responder para continuar a investigação. Formate as perguntas de forma clara, uma por linha.

Responda de forma clara e estruturada, destacando a causa raiz identificada. Se precisar de mais informações, termine sua resposta com perguntas específicas que o usuário deve responder.`

  try {
    const response = await fetch(API_ENDPOINTS.openai, {
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
            content: 'Você é um especialista em análise de causa raiz. Forneça análises detalhadas e úteis.',
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

    if (!response.ok) {
      const error = await response.json()
      let errorMessage = error.error?.message || 'Erro ao chamar API da OpenAI'
      
      // Mensagens de erro mais amigáveis
      if (response.status === 429) {
        if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
          errorMessage = 'Cota excedida. Verifique seus créditos e plano de faturamento em: https://platform.openai.com/account/billing'
        } else {
          errorMessage = 'Muitas requisições. Aguarde alguns minutos e tente novamente.'
        }
      } else if (response.status === 401) {
        errorMessage = 'API key inválida ou expirada. Verifique suas configurações.'
      } else if (response.status === 403) {
        errorMessage = 'Acesso negado. Verifique as permissões da sua API key.'
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    
    // Log completo em desenvolvimento (pode ser removido em produção)
    if (import.meta.env.DEV) {
      console.log('📋 Resposta completa da API:', data)
      console.log('💬 Conteúdo extraído:', data.choices[0].message.content)
      console.log('📊 Uso de tokens:', data.usage)
    }
    
    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Erro ao chamar IA:', error)
    throw error
  }
}

/**
 * Sugere uma resposta para o próximo "Por quê?" baseado no contexto
 */
export async function suggestAnswer(problem, previousAnswers, currentWhyQuestion) {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('API key não configurada. Configure em Configurações > IA.')
  }

  const context = previousAnswers.length > 0
    ? `Respostas anteriores:\n${previousAnswers.map((a, i) => `Por quê ${i + 1}: ${a}`).join('\n')}`
    : 'Esta é a primeira pergunta "Por quê?".'

  const prompt = `Você é um especialista em análise de causa raiz usando o método 5 Porquês.

Problema inicial: ${problem}

${context}

Pergunta atual: ${currentWhyQuestion}

Sugira uma resposta objetiva e específica para esta pergunta que aprofunde a investigação da causa raiz.
A resposta deve ser clara, direta e focada na causa, não no sintoma.`

  try {
    const response = await fetch(API_ENDPOINTS.openai, {
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
            content: 'Você é um especialista em análise de causa raiz. Seja direto e objetivo nas respostas.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      let errorMessage = error.error?.message || 'Erro ao chamar API da OpenAI'
      
      // Mensagens de erro mais amigáveis
      if (response.status === 429) {
        if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
          errorMessage = 'Cota excedida. Verifique seus créditos e plano de faturamento em: https://platform.openai.com/account/billing'
        } else {
          errorMessage = 'Muitas requisições. Aguarde alguns minutos e tente novamente.'
        }
      } else if (response.status === 401) {
        errorMessage = 'API key inválida ou expirada. Verifique suas configurações.'
      } else if (response.status === 403) {
        errorMessage = 'Acesso negado. Verifique as permissões da sua API key.'
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    
    // Log completo em desenvolvimento (pode ser removido em produção)
    if (import.meta.env.DEV) {
      console.log('📋 Resposta completa da API:', data)
      console.log('💬 Conteúdo extraído:', data.choices[0].message.content)
      console.log('📊 Uso de tokens:', data.usage)
    }
    
    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Erro ao chamar IA:', error)
    throw error
  }
}

