# 📝 Como Criar o Arquivo .env

## 🪟 No Windows

### Método 1: Usando o PowerShell (Recomendado)

1. Abra o **PowerShell** ou **Terminal** no VS Code
2. Navegue até a pasta do projeto:
   ```powershell
   cd C:\projetos\SolucaoProblemas
   ```
3. Crie o arquivo `.env`:
   ```powershell
   New-Item -Path .env -ItemType File
   ```
4. Abra o arquivo no editor e adicione:
   ```
   VITE_OPENAI_API_KEY=sk-sua-chave-aqui
   ```

### Método 2: Usando o Explorador de Arquivos

1. Abra o **Explorador de Arquivos** do Windows
2. Navegue até: `C:\projetos\SolucaoProblemas`
3. Clique com o botão direito → **Novo** → **Documento de Texto**
4. Renomeie para `.env` (sem extensão)
   - ⚠️ Se o Windows avisar sobre mudar a extensão, clique em **Sim**
5. Abra o arquivo com o **Bloco de Notas** ou **VS Code**
6. Adicione esta linha:
   ```
   VITE_OPENAI_API_KEY=sk-sua-chave-aqui
   ```
7. Salve o arquivo (Ctrl+S)

### Método 3: Usando o VS Code

1. Abra o projeto no **VS Code**
2. Clique com o botão direito na pasta raiz do projeto
3. Selecione **New File**
4. Digite o nome: `.env`
5. Adicione o conteúdo:
   ```
   VITE_OPENAI_API_KEY=sk-sua-chave-aqui
   ```
6. Salve (Ctrl+S)

## 🐧 No Linux/Mac

### Usando o Terminal

```bash
cd /caminho/para/projeto
touch .env
nano .env
```

Adicione:
```
VITE_OPENAI_API_KEY=sk-sua-chave-aqui
```

Salve: `Ctrl+X`, depois `Y`, depois `Enter`

## ✅ Verificar se Funcionou

1. O arquivo `.env` deve estar na **raiz do projeto** (mesmo nível do `package.json`)
2. Deve conter exatamente:
   ```
   VITE_OPENAI_API_KEY=sk-sua-chave-openai-aqui
   ```
3. **Reinicie o servidor** de desenvolvimento:
   ```bash
   npm run dev
   ```

## ⚠️ Importante

- ✅ O arquivo `.env` já está no `.gitignore` (não será commitado)
- ✅ Use sua **própria API key** (a chave mostrada foi exposta e deve ser revogada)
- ✅ Nunca compartilhe o arquivo `.env`
- ✅ O arquivo deve estar na **raiz do projeto**, não em subpastas

## 🔍 Estrutura Esperada

```
SolucaoProblemas/
├── .env                    ← AQUI (raiz do projeto)
├── .gitignore
├── package.json
├── vite.config.js
├── src/
└── ...
```

## 🆘 Problemas Comuns

**"Arquivo não encontrado"**
- Verifique se está na raiz do projeto
- Verifique se o nome é exatamente `.env` (sem extensão)

**"Variável não carregada"**
- Reinicie o servidor (`npm run dev`)
- Verifique se não há espaços antes ou depois do `=`
- Verifique se a chave começa com `sk-`

**"Windows não deixa renomear"**
- Use o PowerShell: `New-Item -Path .env -ItemType File`
- Ou use o VS Code para criar o arquivo

