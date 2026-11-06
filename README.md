# Adapt em Pauta — modelo de teste

Prévia pública de uma publicação interna. A capa animada abre para o sumário, onde a pessoa escolhe uma edição. Esta cópia usa conteúdo demonstrativo, sem fotos ou registros internos.

## Estrutura

- `index.html`: capa, sumário e área de leitura
- `assets/site.css`: identidade visual, motion, responsividade e impressão
- `assets/site.js`: animação de abertura, seleção e renderização de edições
- `data/editions/index.json`: catálogo de edições disponíveis
- `data/editions/001.json`: conteúdo da edição demonstrativa 001

## Adicionar uma edição

1. Duplique um arquivo de edição, por exemplo `001.json`, e atualize o conteúdo.
2. Inclua uma entrada em `data/editions/index.json` com `id`, `path`, `date`, `label`, `title` e `summary`.
3. Publique as alterações no GitHub Pages.

O site é estático e não precisa de etapa de build. Mantenha esta cópia com conteúdo de demonstração enquanto o repositório estiver público.
