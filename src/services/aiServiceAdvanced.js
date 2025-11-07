/**
 * Versão avançada do serviço de IA que retorna dados completos
 * Use quando precisar de mais informações além do conteúdo
 */

// Função auxiliar para obter API key (mesma lógica do aiService.js)
function getApiKey() {
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    return import.meta.env.VITE_OPENAI_API_KEY
  }
  return localStorage.getItem('resolvai_openai_key')
}

const API_ENDPOINTS = {
  openai: 'https://api.openai.com/v1/chat/completions',
}

/**
 * Faz uma chamada à API e retorna TODOS os dados
 */
export async function callOpenAIWithFullData(prompt, systemMessage = null, options = {}) {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('API key não configurada.')
  }

  const messages = []
  
  if (systemMessage) {
    messages.push({
      role: 'system',
      content: systemMessage,
    })
  }
  
  messages.push({
    role: 'user',
    content: prompt,
  })

  try {
    const response = await fetch(API_ENDPOINTS.openai, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || 'gpt-3.5-turbo',
        messages,
        max_tokens: options.max_tokens || 500,
        temperature: options.temperature || 0.7,
        ...options.extraParams, // Permite passar parâmetros adicionais
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Erro ao chamar API da OpenAI')
    }

    const data = await response.json()
    
    // Retorna objeto completo com todas as informações
    return {
      // Conteúdo da resposta (o que normalmente usamos)
      content: data.choices[0].message.content.trim(),
      
      // Dados completos da resposta
      fullResponse: data,
      
      // Informações úteis
      id: data.id,
      model: data.model,
      created: data.created,
      finishReason: data.choices[0].finish_reason,
      
      // Estatísticas de uso
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      },
      
      // Todas as escolhas (caso tenha múltiplas)
      choices: data.choices,
    }
  } catch (error) {
    console.error('Erro ao chamar IA:', error)
    throw error
  }
}

/**
 * Exemplo de uso:
 * 
 * const result = await callOpenAIWithFullData(
 *   "Explique o método 5 Porquês",
 *   "Você é um especialista em análise de problemas",
 *   { model: 'gpt-4', max_tokens: 1000 }
 * )
 * 
 * console.log('Conteúdo:', result.content)
 * console.log('Tokens usados:', result.usage.totalTokens)
 * console.log('Resposta completa:', result.fullResponse)
 */

