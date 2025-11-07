# ⚡ Configurar Groq (API Gratuita)

## ✅ Chave Configurada

Sua chave do Groq foi adicionada ao arquivo `.env`:

```
VITE_GROQ_API_KEY=gsk_sua-chave-groq-aqui
```

## 🚀 Próximos Passos

1. **Reinicie o servidor de desenvolvimento**:
   ```powershell
   # Pare o servidor atual (Ctrl+C) e inicie novamente
   npm run dev
   ```

2. **Teste a funcionalidade**:
   - Vá para o método "5 Porquês"
   - Preencha um problema
   - Clique em "Sugerir próximo 'Por quê?'"
   - Deve funcionar com Groq agora! ⚡

## 🔒 Importante: Segurança

⚠️ **Sua chave foi compartilhada publicamente!**

Por segurança, você deve:
1. **Revogar esta chave** em: https://console.groq.com/keys
2. **Criar uma nova chave**
3. **Atualizar o arquivo `.env`** com a nova chave

## 📝 Configuração Alternativa (via Interface)

Você também pode configurar via interface:

1. Abra o método "5 Porquês"
2. Clique no ícone **✨ (estrela)** ao lado de "Problema Inicial"
3. Cole sua chave do Groq
4. Clique em "Salvar"

A chave será salva no localStorage do navegador.

## 🎯 Vantagens do Groq

- ✅ **Totalmente gratuito**
- ✅ **Muito rápido** (respostas em milissegundos)
- ✅ **30 requisições/minuto** (plano gratuito)
- ✅ **Sem limite de tokens**
- ✅ **Sem necessidade de cartão de crédito**

## 🆘 Problemas?

Se não funcionar após reiniciar:

1. Verifique se o arquivo `.env` está na raiz do projeto
2. Verifique se a chave está correta
3. Veja o console do navegador (F12) para erros
4. Tente configurar via interface (ícone ✨)

