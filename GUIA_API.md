# 📚 Guia: Como Pegar Dados da API do ChatGPT

Este guia explica como a integração com a API do ChatGPT funciona e como você pode visualizar/testar os dados retornados.

## 🔍 Como Funciona Atualmente

### 1. Estrutura da Requisição

A aplicação faz requisições HTTP POST para a API da OpenAI:

```javascript
POST https://api.openai.com/v1/chat/completions
Headers:
  Content-Type: application/json
  Authorization: Bearer {sua-api-key}

Body:
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "Você é um especialista em análise de causa raiz..."
    },
    {
      "role": "user",
      "content": "Problema inicial: ..."
    }
  ],
  "max_tokens": 150,
  "temperature": 0.7
}
```

### 2. Estrutura da Resposta

A API retorna um JSON com esta estrutura:

```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-3.5-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "A resposta da IA aqui..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 30,
    "total_tokens": 80
  }
}
```

### 3. Como os Dados São Extraídos

No código atual (`src/services/aiService.js`), extraímos apenas o conteúdo:

```javascript
const data = await response.json()
return data.choices[0].message.content.trim()
```

## 🛠️ Como Ver Todos os Dados Retornados

### Opção 1: Usar o Console do Navegador

1. Abra o DevTools (F12)
2. Vá para a aba "Console"
3. Digite:

```javascript
// Testar a API e ver todos os dados
testOpenAIAPI()

// Ou fazer uma chamada direta e ver resposta completa
callOpenAIDirectly("Explique o método 5 Porquês", true)
```

### Opção 2: Modificar o Código para Logs

Adicione logs no arquivo `src/services/aiService.js`:

```javascript
const data = await response.json()

// Adicionar este log para ver tudo
console.log('📋 Resposta completa da API:', JSON.stringify(data, null, 2))
console.log('💬 Conteúdo:', data.choices[0].message.content)
console.log('📊 Uso de tokens:', data.usage)

return data.choices[0].message.content.trim()
```

### Opção 3: Usar Network Tab

1. Abra DevTools (F12)
2. Vá para a aba "Network"
3. Filtre por "chat/completions"
4. Clique em uma requisição
5. Veja:
   - **Headers**: Cabeçalhos enviados
   - **Payload**: Dados enviados
   - **Response**: Dados retornados completos

## 📊 Dados Disponíveis na Resposta

A resposta completa da API contém:

### Informações Principais
- `id`: ID único da conversa
- `model`: Modelo usado (ex: "gpt-3.5-turbo")
- `created`: Timestamp da criação

### Choices (Array)
- `message.role`: "assistant"
- `message.content`: **A resposta da IA (o que usamos)**
- `finish_reason`: Por que parou ("stop", "length", etc.)

### Usage (Estatísticas)
- `prompt_tokens`: Tokens usados no prompt
- `completion_tokens`: Tokens na resposta
- `total_tokens`: Total de tokens (afeta custo)

## 🔧 Exemplo de Uso Avançado

Se você quiser acessar todos os dados, pode modificar as funções:

```javascript
// Em src/services/aiService.js
export async function suggestNextWhy(problem, previousAnswers, returnFullData = false) {
  // ... código existente ...
  
  const data = await response.json()
  
  if (returnFullData) {
    // Retornar objeto completo
    return {
      content: data.choices[0].message.content.trim(),
      fullResponse: data,
      usage: data.usage,
      model: data.model
    }
  }
  
  // Retornar apenas conteúdo (comportamento padrão)
  return data.choices[0].message.content.trim()
}
```

## 🧪 Testar Manualmente

### Via cURL

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-sua-chave-aqui" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {"role": "user", "content": "Explique o método 5 Porquês"}
    ],
    "max_tokens": 150
  }'
```

### Via JavaScript no Console

```javascript
const apiKey = localStorage.getItem('resolvai_openai_key')

fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'user', content: 'Teste' }
    ]
  })
})
.then(r => r.json())
.then(data => {
  console.log('Resposta completa:', data)
  console.log('Conteúdo:', data.choices[0].message.content)
})
```

## 📝 Notas Importantes

1. **Custo**: Cada chamada consome tokens. Monitore em: https://platform.openai.com/usage
2. **Rate Limits**: A API tem limites de requisições por minuto
3. **Segurança**: Nunca exponha sua API key no código ou repositório
4. **Modelos**: Você pode usar outros modelos como `gpt-4`, `gpt-4-turbo`, etc.

## 🔗 Links Úteis

- [Documentação da API](https://platform.openai.com/docs/api-reference/chat)
- [Preços](https://openai.com/pricing)
- [Dashboard de Uso](https://platform.openai.com/usage)

