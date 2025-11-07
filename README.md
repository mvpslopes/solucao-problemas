# ResolvAI

Uma ferramenta pessoal para resolver problemas e tomar decisões de forma estruturada, aplicando métodos de análise e raciocínio lógico.

## 🎯 Características

- **Métodos Estruturados**: Acesse diferentes métodos de resolução de problemas
- **5 Porquês**: Implementado e totalmente funcional
- **Histórico**: Salve e consulte suas análises anteriores
- **Design Moderno**: Interface intuitiva com modo claro/escuro
- **Responsivo**: Funciona perfeitamente em desktop e mobile

## 🚀 Como Usar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 🧩 Métodos Disponíveis

### ✅ Implementado
- **5 Porquês**: Identifique a causa raiz de um problema através de perguntas sucessivas

### 🚧 Em Desenvolvimento
- GUT (Gravidade, Urgência, Tendência)
- SWOT (Forças, Fraquezas, Oportunidades, Ameaças)
- PDCA (Planejar, Fazer, Verificar, Agir)
- SMART (Objetivos Específicos, Mensuráveis, Alcançáveis, Relevantes e Temporais)
- 6W2H (O quê, Por quê, Onde, Quando, Quem, Qual, Como, Quanto)
- Árvore de Decisão
- Brainstorm
- Diário

## 🛠️ Tecnologias

- React 18
- Vite
- TailwindCSS
- Framer Motion
- Lucide React
- React Router DOM

## 📦 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── methods/        # Implementações dos métodos
├── pages/          # Páginas da aplicação
└── App.jsx         # Componente principal
```

## 🤖 Assistente de IA

O ResolvAI agora inclui um assistente de IA integrado para ajudar na busca da causa raiz!

### Funcionalidades da IA:

1. **Sugerir próximo "Por quê?"**: Após definir o problema, a IA pode sugerir o próximo passo na investigação
2. **Sugerir respostas**: Em cada campo "Por quê?", clique no botão "IA" para obter sugestões de resposta
3. **Analisar causa raiz**: Com 2+ respostas preenchidas, a IA pode analisar e sugerir a causa raiz

### Como configurar:

1. **Opção 1 - Variável de ambiente** (recomendado para desenvolvimento):
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione: `VITE_OPENAI_API_KEY=sk-sua-chave-aqui`
   - Reinicie o servidor de desenvolvimento

2. **Opção 2 - Configuração na aplicação**:
   - Clique no ícone de configurações (⚙️) ao lado do campo "Problema Inicial"
   - Cole sua API key da OpenAI
   - A chave será salva localmente no navegador

**Obter API Key**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

> ⚠️ **Nota**: A API key é armazenada apenas localmente no seu navegador. Nunca compartilhe sua chave.

## 🔮 Recursos Futuros

- Exportação de relatórios em PDF
- IA que sugere o método ideal conforme o problema
- Sistema de login e sincronização na nuvem
- Histórico categorizado por tema (trabalho, pessoal, estudo)

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

