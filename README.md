# Meia-Um Engenharia — landing page

Landing page de página única em **HTML, CSS e JavaScript puros**, sem build e
sem dependências de runtime. Reescrita da versão original, que usava Tailwind
via CDN com a configuração inline dentro do HTML.

## Estrutura

```
.
├── index.html              # A landing inteira: 8 seções + rodapé
├── img/
│   ├── logo-meia-um.png            # Logo da marca (cabeçalho, rodapé e favicon)
│   ├── escritorio_meiaUM.webp      # Foto da seção "Regularização" (servida por padrão)
│   └── escritorio_meiaUM.jpg       # Mesma foto em JPEG (fallback do <picture>)
├── assets/
│   ├── css/
│   │   ├── tokens.css      # Variáveis CSS: cores, espaçamentos, tipografia
│   │   ├── base.css        # Reset, elementos, acessibilidade, utilitários
│   │   ├── layout.css      # Cabeçalho, navegação, seções, grades, rodapé
│   │   └── components.css  # Botões, cartões, hero, timeline, formulário
│   └── js/
│       ├── nav.js          # Menu mobile + estado do cabeçalho na rolagem
│       ├── scrollspy.js    # Destaque da seção ativa no menu
│       ├── form.js         # Validação e envio do formulário de contato
│       └── main.js         # Ponto de entrada: inicializa os módulos
└── legacy/
    └── index-tailwind-original.html   # Versão original, para consulta
```

### Seções da página

| Âncora | Seção |
|---|---|
| `#inicio` | Hero com CTA e selo de garantia técnica |
| — | Faixa de alerta sobre imóvel irregular |
| `#diferenciais` | Por que a Meia-Um é a melhor escolha (4 cartões) |
| `#importancia` | Por que isso importa (texto + imagem) |
| `#situacoes` | Você está em algum destes casos? (3 cartões) |
| `#processo` | Como funciona o atendimento (linha do tempo de 4 etapas) |
| `#resultados` | Depoimentos de clientes (3 cartões com avaliação) |
| `#especialista` | Engenheiro chefe |
| `#contato` | Formulário de consulta gratuita + contatos diretos |

## Como executar

Basta abrir `index.html` no navegador — os scripts são clássicos (`defer`),
então funcionam também via `file://`.

Para servir por HTTP:

```bash
npx serve .
# ou
python -m http.server 8000
```

## Decisões técnicas

- **Sem framework CSS.** O tema do Tailwind (cores, espaçamentos, escalas
  tipográficas) virou *design tokens* em `tokens.css`. Trocar uma cor da marca
  é mudar uma linha.
- **Nomenclatura BEM** (`bloco__elemento--modificador`) nos componentes, com um
  punhado mínimo de utilitários (`.mt-md`, `.text-center`).
- **Mobile-first**, breakpoints em 640px e 900px e tipografia fluida
  (`clamp()`), preservando os tamanhos mobile/desktop do layout original.
- **Rolagem suave em CSS** (`scroll-behavior` + `scroll-padding-top`), no lugar
  do script de offset manual da versão anterior.
- **Melhoria progressiva:** o menu nasce como barra estática
  (`site-header--no-js`) e vira menu sanfonado apenas quando o JS assume; o
  formulário valida nativamente se o JS falhar.
- **Acessibilidade:** landmarks semânticos, link "pular para o conteúdo",
  `aria-current` na seção ativa, `aria-expanded`/`aria-controls` no menu,
  `aria-invalid` + `aria-describedby` nos campos, foco visível e suporte a
  `prefers-reduced-motion`.
- **JavaScript modular sem bundler:** cada arquivo registra sua função de
  inicialização em `window.MeiaUm` e `main.js` executa apenas o que existe na
  página.

## Pontos a completar antes de publicar

1. `assets/js/form.js` → função `sendLead()`: hoje o envio é simulado (log no
   console). Aponte para o seu endpoint/CRM.
2. Telefone, WhatsApp e e-mail na seção de contato são placeholders.
3. Imagens de conteúdo (foto do especialista, mesa de trabalho e fundo do hero)
   ainda apontam para as URLs remotas do protótipo. Baixe-as para `img/` e
   sirva localmente. O logo já é local.
4. Fontes: carregadas pelo Google Fonts. Para autonomia total, hospede
   Montserrat, Inter, JetBrains Mono e Material Symbols localmente.
