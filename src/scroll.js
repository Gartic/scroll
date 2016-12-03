'use strict';

/*global Eventos*/

/**
 * Classe para o tratamente genérico de scrolls
 */
class Scroll extends Eventos {
	/**
	 * Construtor da classe, preparando elemento de scroll
	 *
	 * @param {HTMLElement} elem - Elemento que irá englobar toda a lógica do scroll
	 * @param {Array} classes - Lista de classes para aplicar a sombra (topo, meio, rodape)
	 * @param {boolean} manterPosicao - Fixa a posição de visão do scroll
	 * @param {number} elementosMax - Quantidade máxima de elementos
	 */
	constructor(elem, classes = false, manterPosicao = false, elementosMax = 0) {
		super();

		this._elem = elem;
		this._scroll = elem.querySelector('div');
		this._classes = classes;
		this._manterPosicao = manterPosicao;
		this._elementosMax = elementosMax;

		this._classInit = elem.className;

		//filtrando elementos de texto
		for(let filho of this._scroll.childNodes)
			this._scroll.removeChild(filho);

		this._scroll.addEventListener('scroll',() => {
			this._sombras();
		},false);

		//inicializando sombras
		this._sombras();
	}

	/**
	 * Checa se o scroll está no rodapé
	 *
	 * @returns {boolean} Se o scroll chegou ao fim.
	 */
	_checkFim() {
		return (this._scroll.scrollTop + this._scroll.offsetHeight) >= this._scroll.scrollHeight;
	}

	/**
	 * Remove o primeiro elemento-filho do scroll
	 */
	_pop() {
		if(this._scroll.childNodes.length) {
			let elem = this._scroll.childNodes[0];
			if(this._manterPosicao)
				this._scroll.scrollTop -= elem.offsetHeight;
			this._scroll.removeChild(elem);
		}
	}

	/**
	 * Trata a exibição de sombras de acordo com o scroll
	 */
	_sombras() {
		let classes = [];

		if(this._classInit)
			classes.push(this._classInit);

		let fim = this._checkFim();

		//baixo
		if(!fim) {
			if(this._classes) {
				if(this._scroll.scrollTop === 0)
					classes.push(this._classes[2]);
				//topo baixo
				else if(this._scroll.scrollTop > 0)
					classes.push(this._classes[1]);
			}
		} else {
			//topo
			if(this._classes && this._scroll.scrollTop > 0)
				classes.push(this._classes[0]);

			//emitindo evento do final do scroll
			super.emit('fim');
		}

		this._elem.className = classes.join(' ');
	}

	/**
	 * Adiciona um elemento ao scroll
	 *
	 * @param {HTMLElement} elem - Elemento a ser adicionado
	 */
	append(elem) {
		let fim = this._checkFim();

		//mantando quantidade de elementos fixa
		if(this._elementosMax && this._scroll.childNodes.length >= this._elementosMax)
			this._pop();
		this._scroll.appendChild(elem);

		//mantendo scroll no fim
		if(this._manterPosicao && fim)
			this._scroll.scrollTop = this._scroll.scrollHeight;

		this._sombras();
	}

	/**
	 * Move o scroll para um ponto específico
	 *
	 * @param {number} y - Coordenada Y para posicionamento do topo do scroll
	 */
	scrollTo(y) {
		this._scroll.scrollTop = y;
		this._sombras();
	}
}

// Expondo como um modulo common js
if (typeof module !== 'undefined' && module.exports) {
	module.exports = Scroll;
}
