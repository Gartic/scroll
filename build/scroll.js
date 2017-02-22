'use strict';

//Dependência do projeto

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _eventos = require('eventos');

var _eventos2 = _interopRequireDefault(_eventos);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Classe para o tratamente genérico de scrolls
 */
var Scroll = function (_Eventos) {
	_inherits(Scroll, _Eventos);

	/**
  * Construtor da classe, preparando elemento de scroll
  *
  * @param {HTMLElement} elem Elemento que irá englobar toda a lógica do scroll
  * @param {Object} opcoes Configurações do scroll
  * @param {Array} opcoes.classes Lista de classes para aplicar a sombra (topo, meio, rodape)
  * @param {boolean} opcoes.manterPosicao Fixa a posição de visão do scroll
  * @param {number} opcoes.elementosMax Quantidade máxima de elementos
  * @param {boolean} opcoes.scrollVertical Indica se fará uso de scrollbar vertical
  * @param {boolean} opcoes.scrollHorizontal Indica se fará uso de scrollbar horizontal
  * @param {Array} opcoes.margemVertical Margem no topo e rodapé do scroll vertical
  * @param {Array} opcoes.margemHorizontal Margem a esquerda e a direita do scroll horizontal
  * @param {number} opcoes.tolerancia Tolerância para detecção do fim do scroll
  * @param {boolean} opcoes.nativo Indica o uso de scroll nativo
  */
	function Scroll(elem, opcoes) {
		_classCallCheck(this, Scroll);

		//opcoes padrao
		var _this = _possibleConstructorReturn(this, (Scroll.__proto__ || Object.getPrototypeOf(Scroll)).call(this));

		_this._opcoes = Object.assign({
			classes: false,
			manterPosicao: false,
			elementosMax: 0,
			scrollVertical: true,
			scrollHorizontal: false,
			margemVertical: [0, 0],
			margemHorizontal: [0, 0],
			wheel: true,
			tolerancia: 0,
			nativo: false
		}, opcoes);

		_this._elem = elem;
		_this._scroll = elem.querySelector('div');
		_this._sombraClasse = '';
		_this._scrollFim = false;
		_this._startTime = 0;
		_this._startPosition = { x: 0, y: 0 };
		_this._moving = false;

		// this._scroll.style.overflow = 'hidden';
		_this._scroll.addEventListener('scroll', function (e) {
			_this.refresh(true);
			e.stopPropagation();
		}, false);

		//simulando scroll touch
		if (!_this._opcoes.nativo) {
			_this._elem.addEventListener('touchstart', function (e) {
				_this._scrollbarStart(e, true, true);
			}, false);
		}

		//criando scrollbar
		if (_this._opcoes.scrollVertical) {
			_this._scrollbarVertical = document.createElement('div');
			_this._scrollbarVertical.className = 'scrollbar-vertical';
			_this._scrollbarVertical.addEventListener('mousedown', function (e) {
				_this._scrollbarStart(e, true);
				e.stopPropagation();
				e.preventDefault();
			}, false);
			_this._scrollbarVertical.addEventListener('touchstart', function (e) {
				_this._scrollbarStart(e, true);
				e.stopPropagation();
				e.preventDefault();
			}, false);
			_this._elem.appendChild(_this._scrollbarVertical);
		}

		//scroll horizontal
		if (_this._opcoes.scrollHorizontal) {
			_this._scrollbarHorizontal = document.createElement('div');
			_this._scrollbarHorizontal.className = 'scrollbar-horizontal';
			_this._scrollbarHorizontal.addEventListener('mousedown', function (e) {
				_this._scrollbarStart(e, false);
				e.stopPropagation();
			}, false);
			_this._scrollbarHorizontal.addEventListener('touchstart', function (e) {
				_this._scrollbarStart(e, false);
				e.stopPropagation();
			}, false);
			_this._elem.appendChild(_this._scrollbarHorizontal);
		}

		//filtrando elementos de texto
		if (_this._opcoes.elementosMax) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = _this._scroll.childNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var filho = _step.value;

					if (filho.nodeType == 3) _this._scroll.removeChild(filho);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}

		//habilitando rolagem
		if (_this._opcoes.wheel) {
			window.addWheelListener(_this._scroll, function (e) {
				//destravando manutenção de posição
				if (e.deltaY < 0) _this._scrollFim = false;
				//movendo de acordo com o delta
				_this.scrollTo(_this._scroll.scrollLeft + e.deltaX, _this._scroll.scrollTop + e.deltaY);
				e.preventDefault();
			}, true);
		}

		//inicializando sombras e scroll
		_this.refresh();
		return _this;
	}

	/**
  * Remove o primeiro elemento-filho do scroll
  */


	_createClass(Scroll, [{
		key: '_pop',
		value: function _pop() {
			if (this._scroll.childNodes.length) {
				var elem = this._scroll.childNodes[0];
				if (this._opcoes.manterPosicao) this._scroll.scrollTop -= elem.offsetHeight;
				this._scroll.removeChild(elem);
			}
		}

		/**
   * Calcula o tamanho do scrollbar
   */

	}, {
		key: '_scrollbarSize',
		value: function _scrollbarSize() {
			if (this._scrollbarVertical) {
				//checando se o scroll ultrapassa os limites (mobile)
				var dif = 0,
				    top = Math.ceil(this._scroll.scrollTop);
				if (top < 0) {
					dif = top;
					top = 0;
				} else if (top + this._scroll.offsetHeight >= this._scroll.scrollHeight) dif = this._scroll.scrollHeight - (top + this._scroll.offsetHeight);

				//checando se existe scroll
				var fator = this._scroll.offsetHeight / this._scroll.scrollHeight;
				//bug ie fator 99%
				if (fator < 0.99) {
					var altura = Math.floor(this._scroll.offsetHeight * fator);
					this._scrollbarVertical.style.display = '';
					this._scrollbarVertical.style.height = altura + dif - this._opcoes.margemVertical[0] - this._opcoes.margemVertical[1] + 'px';
					this._scrollbarVertical.style.top = top / (this._scroll.scrollHeight - dif - this._scroll.offsetHeight) * (this._scroll.offsetHeight - altura - dif) + this._opcoes.margemVertical[0] + 'px';
				} else this._scrollbarVertical.style.display = 'none';
			}

			if (this._scrollbarHorizontal) {
				//checando se o scroll ultrapassa os limites (mobile)
				var _dif = 0,
				    _top = this._scroll.scrollLeft;
				if (this._scroll.scrollLeft < 0) {
					_top = 0;
					_dif = this._scroll.scrollLeft;
				} else if (this._scroll.scrollLeft + this._scroll.offsetWidth > this._scroll.scrollWidth) {
					_dif = this._scroll.scrollWidth - (this._scroll.scrollLeft + this._scroll.offsetWidth);
				}

				//checando se existe scroll
				var _fator = this._scroll.offsetWidth / this._scroll.scrollWidth;
				//bug ie fator 99%
				if (_fator < 0.99) {
					var _altura = Math.floor(this._scroll.offsetWidth * _fator);
					this._scrollbarHorizontal.style.display = '';
					this._scrollbarHorizontal.style.width = _altura + _dif - this._opcoes.margemHorizontal[0] - this._opcoes.margemHorizontal[1] + 'px';
					this._scrollbarHorizontal.style.left = _top / (this._scroll.scrollWidth - _dif - this._scroll.offsetWidth) * (this._scroll.offsetWidth - _altura - _dif) + this._opcoes.margemHorizontal[0] + 'px';
				} else this._scrollbarHorizontal.style.display = 'none';
			}
		}

		/**
   * Inicia o tratamento de arrasto do scrollbar
   *
   * @param {MouseEvent} e Evento do mouse
   * @param {boolean} vertical Indica se o scroll é vertical ou horizontal
   * @param {boolean} invertido Troca a direção do scroll
   */

	}, {
		key: '_scrollbarStart',
		value: function _scrollbarStart(e, vertical) {
			var _this2 = this;

			var invertido = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			var elem = void 0,
			    start = void 0,
			    top = void 0,
			    max = void 0,
			    attrScroll = void 0,
			    coord = void 0,
			    dif = void 0;

			this._moving = true;
			this._startPosition = {
				x: this._scroll.scrollLeft,
				y: this._scroll.scrollTop
			};

			if (vertical) {
				elem = this._scrollbarVertical;
				start = !e.touches ? e.clientY : e.touches[0].clientY;
				top = elem.offsetTop - this._opcoes.margemVertical[0];
				max = this._scroll.offsetHeight - elem.offsetHeight - this._opcoes.margemVertical[0] - this._opcoes.margemVertical[1];
				attrScroll = 'scrollTop';
				coord = 'clientY';
				dif = this._scroll.scrollHeight - this._scroll.offsetHeight;
			} else {
				elem = this._scrollbarHorizontal;
				start = !e.touches ? e.clientX : e.touches[0].clientX;
				top = elem.offsetLeft - this._opcoes.margemHorizontal[0];
				max = this._scroll.offsetWidth - elem.offsetWidth - this._opcoes.margemHorizontal[0] - this._opcoes.margemHorizontal[1];
				attrScroll = 'scrollLeft';
				coord = 'clientX';
				dif = this._scroll.scrollWidth - this._scroll.offsetWidth;
			}

			var move = function move(e) {
				var pos = void 0;
				if (!invertido) pos = top + (!e.touches ? e[coord] : e.touches[0][coord]) - start;else pos = top + start - (!e.touches ? e[coord] : e.touches[0][coord]);

				if (pos <= 0) pos = 0;else if (pos >= max) pos = max;else e.preventDefault();

				_this2._scroll[attrScroll] = dif * pos / max;
			};
			var end = function end() {
				document.removeEventListener('mousemove', move, false);
				document.removeEventListener('mouseup', end, false);
				if (!invertido) document.removeEventListener('touchmove', move, false);
				document.removeEventListener('touchend', end, true);
				_this2._moving = false;

				if (_this2._opcoes.scrollVertical && Math.abs(_this2._startPosition.y - _this2._scroll.scrollTop) > _this2._opcoes.tolerancia || _this2._opcoes.scrollHorizontal && Math.abs(_this2._startPosition.x - _this2._scroll.scrollLeft) > _this2._opcoes.tolerancia) {
					_get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'emit', _this2).call(_this2, 'moveu');

					e.preventDefault();
					e.stopPropagation();
				}
			};

			document.addEventListener('mousemove', move, false);
			document.addEventListener('mouseup', end, false);
			if (!invertido) document.addEventListener('touchmove', move, false);
			document.addEventListener('touchend', end, true);
		}

		/**
   * Trata a exibição de sombras de acordo com o scroll
   */

	}, {
		key: '_sombras',
		value: function _sombras() {
			var inicio = this._scroll.scrollTop - this._opcoes.tolerancia <= 0;

			//checando se chegou ao final do scroll vertical
			if (this._scroll.scrollTop + this._scroll.offsetHeight + this._opcoes.tolerancia >= this._scroll.scrollHeight) {
				this._scrollFim = true;
				//emitindo evento do final do scroll
				_get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'emit', this).call(this, 'fim');
			} else this._scrollFim = false;

			//checando se chegou ao inicio do scroll
			if (inicio) _get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'emit', this).call(this, 'inicio');

			//verificando suporte a sombras
			if (this._opcoes.classes) {
				var classe = '';

				//baixo
				if (!this._scrollFim) {
					if (this._opcoes.classes) {
						if (inicio) classe = this._opcoes.classes[2];
						//topo baixo
						else if (this._scroll.scrollTop > 0) classe = this._opcoes.classes[1];
					}
				} else {
					//topo
					if (this._opcoes.classes && this._scroll.scrollTop > 0) classe = this._opcoes.classes[0];
				}

				//trocando a classe de sombra do elemento
				if (classe != this._sombraClasse) {
					//removendo sombra atual
					if (this._sombraClasse) this._elem.classList.remove(this._sombraClasse);

					//verificando se existe sombra
					if (classe) {
						this._elem.classList.add(classe);
						this._sombraClasse = classe;
					} else this._sombraClasse = '';
				}
			}
		}

		/**
   * Adiciona um elemento ao scroll
   *
   * @param {HTMLElement} elem - Elemento a ser adicionado
   */

	}, {
		key: 'append',
		value: function append(elem) {
			//mantando quantidade de elementos fixa
			if (this._opcoes.elementosMax && this._scroll.childNodes.length >= this._opcoes.elementosMax) this._pop();
			this._scroll.appendChild(elem);

			//mantendo scroll no fim
			this.refresh();
		}

		/**
   * Atualiza parâmetros do scroll
   *
   * @param {boolean} manual - Indica se a atualização está sendo feita por scroll do usuario
   */

	}, {
		key: 'refresh',
		value: function refresh() {
			var manual = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			if (!manual && this._opcoes.manterPosicao && this._scrollFim) this.scrollTo(undefined, this._scroll.scrollHeight);
			this._scrollbarSize();
			this._sombras();
		}

		/**
   * Move o scroll para um ponto específico
   *
   * @param {number} x Coordenada X para posicionamento do topo do scroll
   * @param {number} y Coordenada Y para posicionamento do topo do scroll
   */

	}, {
		key: 'scrollTo',
		value: function scrollTo(x, y) {
			if (x !== undefined) this._scroll.scrollLeft = x;

			if (y !== undefined) this._scroll.scrollTop = y;
		}

		/**
   * Move o scroll para o fim
   *
   * @param {boolean} x Mover para o fim do scroll horizontal
   * @param {boolean} y Mover para o fim do scroll vertical
   */

	}, {
		key: 'scrollEnd',
		value: function scrollEnd(x, y) {
			x = x ? this._scroll.scrollWidth : undefined;
			y = y ? this._scroll.scrollHeight : undefined;
			this.scrollTo(x, y);
		}
	}]);

	return Scroll;
}(_eventos2.default);

/**
 * Tratamento do scroll do mouse crossbrowser
 * @see {@link https://developer.mozilla.org/pt-BR/docs/Web/Events/wheel}
 */


(function (window, document) {
	var prefix = '',
	    _addEventListener = void 0,
	    support = void 0;

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

	window.addWheelListener = function (elem, callback, useCapture) {
		_addWheelListener(elem, support, callback, useCapture);

		// handle MozMousePixelScroll in older Firefox
		if (support == 'DOMMouseScroll') {
			_addWheelListener(elem, 'MozMousePixelScroll', callback, useCapture);
		}
	};

	function _addWheelListener(elem, eventName, callback, useCapture) {
		elem[_addEventListener](prefix + eventName, support == 'wheel' ? callback : function (originalEvent) {
			!originalEvent && (originalEvent = window.event);

			// create a normalized event object
			var event = {
				// keep a ref to the original event object
				originalEvent: originalEvent,
				target: originalEvent.target || originalEvent.srcElement,
				type: 'wheel',
				deltaMode: originalEvent.type == 'MozMousePixelScroll' ? 0 : 1,
				deltaX: 0,
				deltaY: 0,
				deltaZ: 0,
				preventDefault: function preventDefault() {
					originalEvent.preventDefault ? originalEvent.preventDefault() : originalEvent.returnValue = false;
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

exports.default = Scroll;