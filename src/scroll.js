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
	 * @param {boolean} scrollbar - Indica se fará uso de scrollbar
	 */
	constructor(elem, classes = false, manterPosicao = false, elementosMax = 0, scrollbar = false) {
		super();

		this._elem = elem;
		this._scroll = elem.querySelector('div');
		this._classes = classes;
		this._manterPosicao = manterPosicao;
		this._elementosMax = elementosMax;

		//criando scrollbar
		if (scrollbar) {
			this._scrollbar = document.createElement('div');
			this._scrollbar.className = 'scrollbar';
			this._scrollbar.addEventListener('mousedown', e => {
				this._scrollbarStart(e);
			}, false);
			this._scrollbar.addEventListener('touchstart', e => {
				this._scrollbarStart(e);
			}, false);
			this._elem.appendChild(this._scrollbar);
		}

		this._classInit = elem.className;

		//filtrando elementos de texto
		for (let filho of this._scroll.childNodes)
			this._scroll.removeChild(filho);

		window.addWheelListener(this._scroll, e => {
			this.scrollTo(this._scroll.scrollTop + e.deltaY);
			e.preventDefault();
		});

		// this._scroll.style.overflow = 'hidden';
		this._scroll.addEventListener('scroll', e => {
			this.refresh();
			e.stopPropagation();
		}, true);
		this._scroll.addEventListener('touchmove', e => { e.stopPropagation(); }, true);

		//inicializando sombras e scroll
		this.refresh();
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
		if (this._scroll.childNodes.length) {
			let elem = this._scroll.childNodes[0];
			if (this._manterPosicao)
				this._scroll.scrollTop -= elem.offsetHeight;
			this._scroll.removeChild(elem);
		}
	}

	/**
	 * Calcula o tamanho do scrollbar
	 */
	_scrollbarSize() {
		if (this._scrollbar) {
			//checando se o scroll ultrapassa os limites (mobile)
			let dif = 0, top = this._scroll.scrollTop;
			if(this._scroll.scrollTop < 0) {
				top = 0;
				dif = this._scroll.scrollTop;
			} else if(this._scroll.scrollTop + this._scroll.offsetHeight > this._scroll.scrollHeight) {
				dif = this._scroll.scrollHeight - (this._scroll.scrollTop + this._scroll.offsetHeight);
			}

			//checando se existe scroll
			let fator = this._scroll.offsetHeight / this._scroll.scrollHeight;
			if (fator < 1) {
				let altura = Math.floor(this._scroll.offsetHeight * fator);
				this._scrollbar.style.display = '';
				this._scrollbar.style.height = (altura + dif) + 'px';
				this._scrollbar.style.top = ((top / (this._scroll.scrollHeight - dif - this._scroll.offsetHeight)) * (this._scroll.offsetHeight - altura - dif)) + 'px';
			} else
				this._scrollbar.style.display = 'none';
		}
	}

	/**
	 * Inicia o tratamento de arrasto do scrollbar
	 *
	 * @param {MouseEvent} e - Evento do mouse
	 */
	_scrollbarStart(e) {
		let startY = (!e.touches) ? e.clientY : e.touches[0].clientY;
		let top = this._scrollbar.offsetTop;
		let max = this._scroll.offsetHeight - this._scrollbar.offsetHeight;

		let move = e => {
			let pos = top + ((!e.touches) ? e.clientY : e.touches[0].clientY) - startY;
			if (pos < 0) pos = 0;
			else if (pos > max) pos = max;

			this._scrollbar.style.top = pos + 'px';
			this._scroll.scrollTop = (this._scroll.scrollHeight - this._scroll.offsetHeight) * pos / max;
			e.stopPropagation();
			e.preventDefault();
		};
		let end = () => {
			document.body.removeEventListener('mousemove', move, false);
			document.body.removeEventListener('mouseup', end, false);
			document.body.removeEventListener('touchmove', move, false);
			document.body.removeEventListener('touchend', end, false);
		};

		document.body.addEventListener('mousemove', move, false);
		document.body.addEventListener('mouseup', end, false);
		document.body.addEventListener('touchmove', move, false);
		document.body.addEventListener('touchend', end, false);

		e.stopPropagation();
		e.preventDefault();
	}

	/**
	 * Trata a exibição de sombras de acordo com o scroll
	 */
	_sombras() {
		let classes = [];

		if (this._classInit)
			classes.push(this._classInit);

		let fim = this._checkFim();

		//baixo
		if (!fim) {
			if (this._classes) {
				if (this._scroll.scrollTop === 0)
					classes.push(this._classes[2]);
				//topo baixo
				else if (this._scroll.scrollTop > 0)
					classes.push(this._classes[1]);
			}
		} else {
			//topo
			if (this._classes && this._scroll.scrollTop > 0)
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
		if (this._elementosMax && this._scroll.childNodes.length >= this._elementosMax)
			this._pop();
		this._scroll.appendChild(elem);

		//mantendo scroll no fim
		if (this._manterPosicao && fim)
			this.scrollTo(this._scroll.scrollHeight);
		else
			this.refresh();
	}

	/**
	 * Atualiza parâmetros do scroll
	 */
	refresh() {
		this._scrollbarSize();
		this._sombras();
	}

	/**
	 * Move o scroll para um ponto específico
	 *
	 * @param {number} y - Coordenada Y para posicionamento do topo do scroll
	 */
	scrollTo(y) {
		this._scroll.scrollTop = y;
	}
}

/**
 * Tratamento do scroll do mouse crossbrowser
 * @see {@link https://developer.mozilla.org/pt-BR/docs/Web/Events/wheel}
 */
(function(window, document) {
	let prefix = '',
		_addEventListener, support;

	// detect event model
	if (window.addEventListener) {
		_addEventListener = 'addEventListener';
	} else {
		_addEventListener = 'attachEvent';
		prefix = 'on';
	}

	// detect available wheel event
	support = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support 'wheel'
		document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least 'mousewheel'
		'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

	window.addWheelListener = function(elem, callback, useCapture) {
		_addWheelListener(elem, support, callback, useCapture);

		// handle MozMousePixelScroll in older Firefox
		if (support == 'DOMMouseScroll') {
			_addWheelListener(elem, 'MozMousePixelScroll', callback, useCapture);
		}
	};

	function _addWheelListener(elem, eventName, callback, useCapture) {
		elem[_addEventListener](prefix + eventName, support == 'wheel' ? callback : function(originalEvent) {
			!originalEvent && (originalEvent = window.event);

			// create a normalized event object
			let event = {
				// keep a ref to the original event object
				originalEvent: originalEvent,
				target: originalEvent.target || originalEvent.srcElement,
				type: 'wheel',
				deltaMode: originalEvent.type == 'MozMousePixelScroll' ? 0 : 1,
				deltaX: 0,
				deltaY: 0,
				deltaZ: 0,
				preventDefault: function() {
					originalEvent.preventDefault ?
						originalEvent.preventDefault() :
						originalEvent.returnValue = false;
				}
			};

			// calculate deltaY (and deltaX) according to the event
			if (support == 'mousewheel') {
				event.deltaY = -1 / 40 * originalEvent.wheelDelta;
				// Webkit also support wheelDeltaX
				originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
			} else {
				event.deltaY = originalEvent.detail;
			}

			// it's time to fire the callback
			return callback(event);

		}, useCapture || false);
	}

})(window, document);

// Expondo como um modulo common js
if (typeof module !== 'undefined' && module.exports) {
	module.exports = Scroll;
}
