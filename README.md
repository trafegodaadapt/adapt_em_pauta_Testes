# Adapt em Pauta — modelo de teste

Prévia pública com conteúdo demonstrativo. Esta edição substitui fotos, nomes e registros internos por texto ilustrativo para validar o layout e a navegação.

## Estrutura

- `index.html`: estrutura e pontos de entrada das editorias
- `assets/site.css`: identidade visual, responsividade e impressão
- `assets/site.js`: renderização dos dados e interações
- `data/editions/001.json`: conteúdo da edição de demonstração

## Atualizar uma edição

Edite o JSON dentro de `data/editions/`. Preserve as chaves usadas em `assets/site.js` e mantenha textos de demonstração nesta cópia pública. Para uma nova edição, crie outro arquivo JSON e atualize a edição apontada no HTML/JavaScript.

## Recursos nesta prévia

- navegação por editorias e link de salto para o conteúdo
- busca nas histórias desta edição
- botão para copiar `#empauta`
- chamada para abrir o Feedz
- layout adaptável a telas pequenas e folha de impressão
- estilos para preferência de movimento reduzido e foco visível

O repositório publica como site estático pelo GitHub Pages; não há etapa de build.
