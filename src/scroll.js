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
	 * @param {Object} opcoes - Configurações do scroll
	 * @param {Array} opcoes.classes - Lista de classes para aplicar a sombra (topo, meio, rodape)
	 * @param {boolean} opcoes.manterPosicao - Fixa a posição de visão do scroll
	 * @param {number} opcoes.elementosMax - Quantidade máxima de elementos
	 * @param {boolean} opcoes.scrollVertical - Indica se fará uso de scrollbar vertical
	 * @param {boolean} opcoes.scrollHorizontal - Indica se fará uso de scrollbar horizontal
	 */
	constructor(elem, opcoes) {
		super();

		//opcoes padrao
		this._opcoes = Object.assign({
			classes: false,
			manterPosicao: false,
			elementosMax: 0,
			scrollVertical: true,
			scrollHorizontal: false,
		},opcoes);

		this._elem = elem;
		this._scroll = elem.querySelector('div');

		//criando scrollbar
		if (this._opcoes.scrollVertical) {
			this._scrollbarVertical = document.createElement('div');
			this._scrollbarVertical.className = 'scrollbar-vertical';
			this._scrollbarVertical.addEventListener('mousedown', e => {
				this._scrollbarStart(e,true);
			}, false);
			this._scrollbarVertical.addEventListener('touchstart', e => {
				this._scrollbarStart(e,true);
			}, false);
			this._elem.appendChild(this._scrollbarVertical);
		}

		//scroll horizontal
		if (this._opcoes.scrollHorizontal) {
			this._scrollbarHorizontal = document.createElement('div');
			this._scrollbarHorizontal.className = 'scrollbar-horizontal';
			this._scrollbarHorizontal.addEventListener('mousedown', e => {
				this._scrollbarStart(e,false);
			}, false);
			this._scrollbarHorizontal.addEventListener('touchstart', e => {
				this._scrollbarStart(e,false);
			}, false);
			this._elem.appendChild(this._scrollbarHorizontal);
		}

		this._classInit = elem.className;

		//filtrando elementos de texto
		if (this._opcoes.elementosMax) {
			for (let filho of this._scroll.childNodes) {
				if(filho.nodeType == 3)
					this._scroll.removeChild(filho);
			}
		}

		window.addWheelListener(this._scroll, e => {
			this.scrollTo(this._scroll.scrollLeft + e.deltaX,this._scroll.scrollTop + e.deltaY);
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
			if (this._opcoes.manterPosicao)
				this._scroll.scrollTop -= elem.offsetHeight;
			this._scroll.removeChild(elem);
		}
	}

	/**
	 * Calcula o tamanho do scrollbar
	 */
	_scrollbarSize() {
		if (this._scrollbarVertical) {
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
				this._scrollbarVertical.style.display = '';
				this._scrollbarVertical.style.height = (altura + dif) + 'px';
				this._scrollbarVertical.style.top = ((top / (this._scroll.scrollHeight - dif - this._scroll.offsetHeight)) * (this._scroll.offsetHeight - altura - dif)) + 'px';
			} else
				this._scrollbarVertical.style.display = 'none';
		}

		if (this._scrollbarHorizontal) {
			//checando se o scroll ultrapassa os limites (mobile)
			let dif = 0, top = this._scroll.scrollLeft;
			if(this._scroll.scrollLeft < 0) {
				top = 0;
				dif = this._scroll.scrollLeft;
			} else if(this._scroll.scrollLeft + this._scroll.offsetWidth > this._scroll.scrollWidth) {
				dif = this._scroll.scrollWidth - (this._scroll.scrollLeft + this._scroll.offsetWidth);
			}

			//checando se existe scroll
			let fator = this._scroll.offsetWidth / this._scroll.scrollWidth;
			if (fator < 1) {
				let altura = Math.floor(this._scroll.offsetWidth * fator);
				this._scrollbarHorizontal.style.display = '';
				this._scrollbarHorizontal.style.width = (altura + dif) + 'px';
				this._scrollbarHorizontal.style.left = ((top / (this._scroll.scrollWidth - dif - this._scroll.offsetWidth)) * (this._scroll.offsetWidth - altura - dif)) + 'px';
			} else
				this._scrollbarHorizontal.style.display = 'none';
		}
	}

	/**
	 * Inicia o tratamento de arrasto do scrollbar
	 *
	 * @param {MouseEvent} e - Evento do mouse
	 * @param {boolean} vertical - Indica se o scroll é vertical ou horizontal
	 */
	_scrollbarStart(e, vertical) {
		let elem, start, top, max, attr, attrScroll, coord, dif;

		if(vertical) {
			elem = this._scrollbarVertical;
			start = (!e.touches) ? e.clientY : e.touches[0].clientY;
			top = elem.offsetTop;
			max = this._scroll.offsetHeight - elem.offsetHeight;
			attr = 'top';
			attrScroll = 'scrollTop';
			coord = 'clientY';
			dif = this._scroll.scrollHeight - this._scroll.offsetHeight;
		} else {
			elem = this._scrollbarHorizontal;
			start = (!e.touches) ? e.clientX : e.touches[0].clientX;
			top = elem.offsetLeft;
			max = this._scroll.offsetWidth - elem.offsetWidth;
			attr = 'left';
			attrScroll = 'scrollLeft';
			coord = 'clientX';
			dif = this._scroll.scrollWidth - this._scroll.offsetWidth;
		}

		let move = e => {
			let pos = top + ((!e.touches) ? e[coord] : e.touches[0][coord]) - start;
			if (pos < 0) pos = 0;
			else if (pos > max) pos = max;

			elem.style[attr] = pos + 'px';
			this._scroll[attrScroll] = dif * pos / max;
			e.stopPropagation();
			e.preventDefault();
		};
		let end = () => {
			document.removeEventListener('mousemove', move, false);
			document.removeEventListener('mouseup', end, false);
			document.removeEventListener('touchmove', move, false);
			document.removeEventListener('touchend', end, false);
		};

		document.addEventListener('mousemove', move, false);
		document.addEventListener('mouseup', end, false);
		document.addEventListener('touchmove', move, false);
		document.addEventListener('touchend', end, false);

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
			if (this._opcoes.classes) {
				if (this._scroll.scrollTop === 0)
					classes.push(this._opcoes.classes[2]);
				//topo baixo
				else if (this._scroll.scrollTop > 0)
					classes.push(this._opcoes.classes[1]);
			}
		} else {
			//topo
			if (this._opcoes.classes && this._scroll.scrollTop > 0)
				classes.push(this._opcoes.classes[0]);

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
		if (this._opcoes.elementosMax && this._scroll.childNodes.length >= this._opcoes.elementosMax)
			this._pop();
		this._scroll.appendChild(elem);

		//mantendo scroll no fim
		if (this._opcoes.manterPosicao && fim)
			this.scrollTo(undefined, this._scroll.scrollHeight);
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
	 * @param {number} x - Coordenada X para posicionamento do topo do scroll
	 * @param {number} y - Coordenada Y para posicionamento do topo do scroll
	 */
	scrollTo(x = -1, y = -1) {
		if(x != -1)
			this._scroll.scrollLeft = x;
		if(y != -1)
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
