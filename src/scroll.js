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
	 * @param {Array} opcoes.margemVertical - Margem no topo e rodapé do scroll vertical
	 * @param {Array} opcoes.margemHorizontal - Margem a esquerda e a direita do scroll horizontal
	 * @param {number} opcoes.toleranciaFim - Tolerância para detecção do fim do scroll
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
			margemVertical: [0,0],
			margemHorizontal: [0,0],
			wheel: true,
			toleranciaFim: 0
		},opcoes);

		this._elem = elem;
		this._scroll = elem.querySelector('div');
		this._sombraClasse = '';
		this._scrollFim = false;

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

		//filtrando elementos de texto
		if (this._opcoes.elementosMax) {
			for (let filho of this._scroll.childNodes) {
				if(filho.nodeType == 3)
					this._scroll.removeChild(filho);
			}
		}

		//habilitando rolagem
		if(this._opcoes.wheel) {
			window.addWheelListener(this._scroll, e => {
				//destravando manutenção de posição
				if(e.deltaY < 0) this._scrollFim = false;
				//movendo de acordo com o delta
				this.scrollTo(this._scroll.scrollLeft + e.deltaX,this._scroll.scrollTop + e.deltaY);
				e.preventDefault();
			},true);
		}

		// this._scroll.style.overflow = 'hidden';
		this._scroll.addEventListener('scroll', e => {
			this.refresh(true);
			e.stopPropagation();
		}, true);
		this._scroll.addEventListener('touchmove', e => { e.stopPropagation(); }, true);

		//inicializando sombras e scroll
		this.refresh();
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
			let dif = 0, top = Math.ceil(this._scroll.scrollTop);
			if(top < 0) {
				dif = top;
				top = 0;
			} else if(top + this._scroll.offsetHeight >= this._scroll.scrollHeight)
				dif = this._scroll.scrollHeight - (top + this._scroll.offsetHeight);

			//checando se existe scroll
			let fator = this._scroll.offsetHeight / this._scroll.scrollHeight;
			//bug ie fator 99%
			if (fator < 0.99) {
				let altura = Math.floor(this._scroll.offsetHeight * fator);
				this._scrollbarVertical.style.display = '';
				this._scrollbarVertical.style.height = (altura + dif - this._opcoes.margemVertical[0] - this._opcoes.margemVertical[1]) + 'px';
				this._scrollbarVertical.style.top = ((top / (this._scroll.scrollHeight - dif - this._scroll.offsetHeight)) * (this._scroll.offsetHeight - altura - dif) + this._opcoes.margemVertical[0]) + 'px';
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
			//bug ie fator 99%
			if (fator < 0.99) {
				let altura = Math.floor(this._scroll.offsetWidth * fator);
				this._scrollbarHorizontal.style.display = '';
				this._scrollbarHorizontal.style.width = (altura + dif - this._opcoes.margemHorizontal[0] - this._opcoes.margemHorizontal[1]) + 'px';
				this._scrollbarHorizontal.style.left = ((top / (this._scroll.scrollWidth - dif - this._scroll.offsetWidth)) * (this._scroll.offsetWidth - altura - dif) + this._opcoes.margemHorizontal[0]) + 'px';
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
		let elem, start, top, max, attrScroll, coord, dif;

		if(vertical) {
			elem = this._scrollbarVertical;
			start = (!e.touches) ? e.clientY : e.touches[0].clientY;
			top = elem.offsetTop - this._opcoes.margemVertical[0];
			max = this._scroll.offsetHeight - elem.offsetHeight - this._opcoes.margemVertical[0] - this._opcoes.margemVertical[1];
			attrScroll = 'scrollTop';
			coord = 'clientY';
			dif = this._scroll.scrollHeight - this._scroll.offsetHeight;
		} else {
			elem = this._scrollbarHorizontal;
			start = (!e.touches) ? e.clientX : e.touches[0].clientX;
			top = elem.offsetLeft - this._opcoes.margemHorizontal[0];
			max = this._scroll.offsetWidth - elem.offsetWidth - this._opcoes.margemHorizontal[0] - this._opcoes.margemHorizontal[1];
			attrScroll = 'scrollLeft';
			coord = 'clientX';
			dif = this._scroll.scrollWidth - this._scroll.offsetWidth;
		}

		let move = e => {
			let pos = top + ((!e.touches) ? e[coord] : e.touches[0][coord]) - start;
			if (pos < 0) pos = 0;
			else if (pos > max) pos = max;

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
		//checando se chegou ao final do scroll vertical
		if (this._scroll.scrollTop + this._scroll.offsetHeight + this._opcoes.toleranciaFim >= this._scroll.scrollHeight) {
			this._scrollFim = true;
			//emitindo evento do final do scroll
			super.emit('fim');
		} else
			this._scrollFim = false;

		if(this._opcoes.classes) {
			let classe = '';

			//baixo
			if (!this._scrollFim) {
				if (this._opcoes.classes) {
					if (this._scroll.scrollTop <= 0)
						classe = this._opcoes.classes[2];
					//topo baixo
					else if (this._scroll.scrollTop > 0)
						classe = this._opcoes.classes[1];
				}
			} else {
				//topo
				if (this._opcoes.classes && this._scroll.scrollTop > 0)
					classe = this._opcoes.classes[0];
			}

			//trocando a classe de sombra do elemento
			if(classe != this._sombraClasse) {
				//removendo sombra atual
				if(this._sombraClasse)
					this._elem.classList.remove(this._sombraClasse);

				//verificando se existe sombra
				if(classe) {
					this._elem.classList.add(classe);
					this._sombraClasse = classe;
				} else
					this._sombraClasse = '';
			}
		}
	}

	/**
	 * Adiciona um elemento ao scroll
	 *
	 * @param {HTMLElement} elem - Elemento a ser adicionado
	 */
	append(elem) {
		//mantando quantidade de elementos fixa
		if (this._opcoes.elementosMax && this._scroll.childNodes.length >= this._opcoes.elementosMax)
			this._pop();
		this._scroll.appendChild(elem);

		//mantendo scroll no fim
		this.refresh();
	}

	/**
	 * Atualiza parâmetros do scroll
	 *
	 * @param {boolean} manual - Indica se a atualização está sendo feita por scroll do usuario
	 */
	refresh(manual = false) {
		if(!manual && this._opcoes.manterPosicao && this._scrollFim) this.scrollTo(undefined,this._scroll.scrollHeight);
		this._scrollbarSize();
		this._sombras();
	}

	/**
	 * Move o scroll para um ponto específico
	 *
	 * @param {number} x - Coordenada X para posicionamento do topo do scroll
	 * @param {number} y - Coordenada Y para posicionamento do topo do scroll
	 */
	scrollTo(x, y) {
		if(x !== undefined)
			this._scroll.scrollLeft = x;

		if(y !== undefined)
			this._scroll.scrollTop = y;
	}

	/**
	 * Move o scroll para o fim
	 *
	 * @param {boolean} x - Mover para o fim do scroll horizontal
	 * @param {boolean} y - Mover para o fim do scroll vertical
	 */
	scrollEnd(x, y) {
		if(x) this._scroll.scrollLeft = this._scroll.scrollWidth;
		if(y) this._scroll.scrollTop = this._scroll.scrollHeight;
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
