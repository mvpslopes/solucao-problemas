# 🔑 Como Configurar sua API Key do OpenAI

## ⚠️ IMPORTANTE: Segurança

**NUNCA compartilhe sua API key publicamente!** Se você já compartilhou, revogue a chave imediatamente em: https://platform.openai.com/api-keys

## 📝 Métodos de Configuração

### Método 1: Via Interface da Aplicação (Mais Fácil)

1. Abra o ResolvAI
2. Vá para o método **"5 Porquês"**
3. Clique no ícone de **configurações (⚙️)** ao lado do campo "Problema Inicial"
4. Cole sua API key no campo
5. Clique em **"Salvar"**

✅ A chave será salva localmente no seu navegador

### Método 2: Via Arquivo .env (Para Desenvolvimento)

1. Crie um arquivo `.env` na **raiz do projeto** (mesmo nível do `package.json`)
2. Adicione esta linha:
   ```
   VITE_OPENAI_API_KEY=sk-sua-chave-aqui
   ```
3. **Reinicie o servidor de desenvolvimento** (`npm run dev`)

⚠️ **IMPORTANTE**: O arquivo `.env` já está no `.gitignore`, então não será commitado no Git.

### Método 3: Verificar se está Configurada

No console do navegador (F12), digite:
```javascript
localStorage.getItem('resolvai_openai_key')
```

Se retornar sua chave, está configurada! ✅

## 🔒 Obter uma Nova API Key

1. Acesse: https://platform.openai.com/api-keys
2. Faça login na sua conta
3. Clique em **"Create new secret key"**
4. Dê um nome (ex: "ResolvAI")
5. **Copie a chave imediatamente** (ela só aparece uma vez!)
6. Configure usando um dos métodos acima

## 🛡️ Boas Práticas

- ✅ Use a interface da aplicação para configurar
- ✅ Monitore seu uso em: https://platform.openai.com/usage
- ✅ Configure limites de gastos se necessário
- ❌ NUNCA compartilhe sua chave
- ❌ NUNCA commite arquivos `.env`
- ❌ NUNCA coloque a chave em código fonte

## 📊 Monitoramento de Uso

Após configurar, monitore:
- **Dashboard**: https://platform.openai.com/usage
- **Limites de Gasto**: https://platform.openai.com/account/billing/limits

## 🆘 Problemas Comuns

**"API key não configurada"**
- Verifique se salvou corretamente
- Tente configurar novamente via interface

**"Erro ao chamar API"**
- Verifique se a chave está correta
- Verifique se tem créditos na conta OpenAI
- Veja o console do navegador (F12) para mais detalhes

**"Rate limit exceeded"**
- Você fez muitas requisições
- Aguarde alguns minutos e tente novamente
