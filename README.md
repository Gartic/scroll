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
- [Múltiplo](demos/multiplo/) - Scroll horizontal e vertical, com alteração de tamanho

## API

### new Scroll(elem[, opcoes])
- `elem` **HTMLElement** - Elemento que irá englobar toda a lógica do scroll
- `opcoes` **Object** - Configurações do scroll
- `opcoes.classes` **Array** - Lista de classes para aplicar a sombra (topo, meio, rodape)
- `opcoes.manterPosicao` **Boolean** - Fixa a posição de visão do scroll
- `opcoes.elementosMax` **Number** - Quantidade máxima de elementos
- `opcoes.scrollVertical` **Boolean** - Indica se fará uso de scrollbar vertical
- `opcoes.scrollHorizontal` **Boolean** - Indica se fará uso de scrollbar horizontal
- `opcoes.margemVertical` **Array** - Margem no topo e rodapé do scroll vertical
- `opcoes.margemHorizontal` **Array** - Margem a esquerda e a direita do scroll horizontal

Construtor da classe, iniciando variáveis globais da classe e rotina.

### scroll.append(elem)
- `elem` **HTMLElement** - Elemento a ser adicionado

Adiciona um elemento ao scroll.

### scroll.refresh()

Atualiza parâmetros do scroll.

### scroll.scrollTo(y)
- `y` **Number** - Coordenada Y para posicionamento do topo do scroll
- `x` **Number** - Coordenada X para posicionamento do topo do scroll

Move o scroll para um ponto específico.

### Evento: 'fim'

Detecta que está no final da rolagem.
