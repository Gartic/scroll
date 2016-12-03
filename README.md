# Scroll

Tratamento genérico de scrolls no Gartic

## Build

Para gerar o arquivo compilado e compatível com todos os browsers via babel,
executar o comando:
```
npm run build
```

## Sintaxe

Verificar a sintaxe padrão através do comando:
```
npm test
```
## Demo
Lista de demonstrações de uso:
- [Básico](demos/basico/) - Scroll com sombras, manter posição, limite de elementos e evento

## API

### new Scroll(elem[, classes[, manterPosicao[, elementosMax]]])
- `elem` **HTMLElement** - Elemento que irá englobar toda a lógica do scroll
- `classes` **Array** - Lista de classes para aplicar a sombra (topo, meio, rodape)
- `manterPosicao` **boolean** - Fixa a posição de visão do scroll
- `elementosMax` **number** - Quantidade máxima de elementos

Construtor da classe, iniciando variáveis globais da classe e rotina.

### scroll.append(elem)
- `elem` **HTMLElement** - Elemento a ser adicionado

Adiciona um elemento ao scroll.

### scroll.scrollTo(y)
- `y` **Number** - Coordenada Y para posicionamento do topo do scroll

Move o scroll para um ponto específico.

### Evento: 'fim'

Detecta que está no final da rolagem.
