# Meia-Um Engenharia — site institucional

Site estático em **HTML, CSS e JavaScript puros**, sem build e sem dependências
de runtime. Reescrita da landing page única original (que usava Tailwind via CDN
com a configuração inline no HTML), agora dividida por páginas.

## Estrutura

```
.
├── index.html              # Home: hero, alerta, diferenciais, por que importa
├── servicos.html           # Situações que atendemos (casos de risco)
├── processo.html           # As 4 etapas do atendimento (linha do tempo)
├── especialista.html       # Engenheiro chefe e equipe
├── contato.html            # Formulário de consulta gratuita e contatos diretos
├── assets/
│   ├── css/
│   │   ├── tokens.css      # Variáveis CSS: cores, espaçamentos, tipografia
│   │   ├── base.css        # Reset, elementos, acessibilidade, utilitários
│   │   ├── layout.css      # Cabeçalho, navegação, seções, grades, rodapé
│   │   └── components.css  # Botões, cartões, hero, timeline, formulário
│   └── js/
│       ├── nav.js          # Menu mobile + estado do cabeçalho na rolagem
│       ├── form.js         # Validação e envio do formulário de contato
│       └── main.js         # Ponto de entrada: inicializa o que existe na página
└── legacy/
    └── index-tailwind-original.html   # Landing page original, para consulta
```

## Como executar

Basta abrir `index.html` no navegador. Os scripts são clássicos (`defer`), então
funcionam também via `file://`.

Para servir por HTTP (recomendado para testar cache, fontes e o formulário):

```bash
npx serve .
# ou
python -m http.server 8000
```

## Decisões técnicas

- **Sem framework CSS.** O tema do Tailwind (cores, espaçamentos, escalas
  tipográficas) foi convertido em *design tokens* em `tokens.css`. Alterar uma
  cor da marca é mudar uma linha.
- **Nomenclatura BEM** (`bloco__elemento--modificador`) nos componentes, com um
  punhado mínimo de utilitários (`.mt-md`, `.text-center`).
- **Mobile-first**, com breakpoints em 640px e 900px e tipografia fluida
  (`clamp()`), preservando os tamanhos mobile/desktop do layout original.
- **Rolagem suave em CSS** (`scroll-behavior` + `scroll-padding-top`), no lugar
  do script de offset manual da versão anterior.
- **Melhoria progressiva:** o menu nasce como barra estática
  (`site-header--no-js`) e vira menu sanfonado apenas quando o JS assume; o
  formulário valida nativamente se o JS falhar.
- **Acessibilidade:** landmarks semânticos, link "pular para o conteúdo",
  `aria-current` na página ativa, `aria-expanded`/`aria-controls` no menu,
  `aria-invalid` + `aria-describedby` nos campos, foco visível e suporte a
  `prefers-reduced-motion`.
- **JavaScript modular sem bundler:** cada arquivo registra sua função de
  inicialização em `window.MeiaUm` e `main.js` executa apenas o que existe na
  página.

## Pontos a completar antes de publicar

1. `assets/js/form.js` → função `sendLead()`: hoje o envio é simulado (log no
   console). Aponte para o seu endpoint/CRM.
2. `contato.html`: telefone, WhatsApp e e-mail são placeholders.
3. Imagens: ainda apontam para as URLs remotas do protótipo. Baixe-as para
   `assets/img/` e sirva localmente (com `width`/`height` reais) para melhor
   desempenho.
4. Fontes: carregadas pelo Google Fonts. Para autonomia total, hospede
   Montserrat, Inter, JetBrains Mono e Material Symbols localmente.
