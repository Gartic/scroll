'use strict';

/*global Eventos*/

/**
 * Classe para o tratamente genérico de scrolls
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scroll = function (_Eventos) {
	_inherits(Scroll, _Eventos);

	/**
  * Construtor da classe, preparando elemento de scroll
  *
  * @param {HTMLElement} elem - Elemento que irá englobar toda a lógica do scroll
  * @param {Array} classes - Lista de classes para aplicar a sombra (topo, meio, rodape)
  * @param {boolean} manterPosicao - Fixa a posição de visão do scroll
  * @param {number} elementosMax - Quantidade máxima de elementos
  * @param {boolean} scrollbarVertical - Indica se fará uso de scrollbar vertical
  * @param {boolean} scrollbarHorizontal - Indica se fará uso de scrollbar horizontal
  */
	function Scroll(elem) {
		var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var manterPosicao = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		var elementosMax = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
		var scrollbarVertical = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
		var scrollbarHorizontal = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

		_classCallCheck(this, Scroll);

		var _this = _possibleConstructorReturn(this, (Scroll.__proto__ || Object.getPrototypeOf(Scroll)).call(this));

		_this._elem = elem;
		_this._scroll = elem.querySelector('div');
		_this._classes = classes;
		_this._manterPosicao = manterPosicao;
		_this._elementosMax = elementosMax;

		//criando scrollbar
		if (scrollbarVertical) {
			_this._scrollbarVertical = document.createElement('div');
			_this._scrollbarVertical.className = 'scrollbar-vertical';
			_this._scrollbarVertical.addEventListener('mousedown', function (e) {
				_this._scrollbarStart(e, true);
			}, false);
			_this._scrollbarVertical.addEventListener('touchstart', function (e) {
				_this._scrollbarStart(e, true);
			}, false);
			_this._elem.appendChild(_this._scrollbarVertical);
		}

		//scroll horizontal
		if (scrollbarHorizontal) {
			_this._scrollbarHorizontal = document.createElement('div');
			_this._scrollbarHorizontal.className = 'scrollbar-horizontal';
			_this._scrollbarHorizontal.addEventListener('mousedown', function (e) {
				_this._scrollbarStart(e, false);
			}, false);
			_this._scrollbarHorizontal.addEventListener('touchstart', function (e) {
				_this._scrollbarStart(e, false);
			}, false);
			_this._elem.appendChild(_this._scrollbarHorizontal);
		}

		_this._classInit = elem.className;

		//filtrando elementos de texto
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = _this._scroll.childNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var filho = _step.value;

				_this._scroll.removeChild(filho);
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

		window.addWheelListener(_this._scroll, function (e) {
			_this.scrollTo(_this._scroll.scrollLeft + e.deltaX, _this._scroll.scrollTop + e.deltaY);
			e.preventDefault();
		});

		// this._scroll.style.overflow = 'hidden';
		_this._scroll.addEventListener('scroll', function (e) {
			_this.refresh();
			e.stopPropagation();
		}, true);
		_this._scroll.addEventListener('touchmove', function (e) {
			e.stopPropagation();
		}, true);

		//inicializando sombras e scroll
		_this.refresh();
		return _this;
	}

	/**
  * Checa se o scroll está no rodapé
  *
  * @returns {boolean} Se o scroll chegou ao fim.
  */


	_createClass(Scroll, [{
		key: '_checkFim',
		value: function _checkFim() {
			return this._scroll.scrollTop + this._scroll.offsetHeight >= this._scroll.scrollHeight;
		}

		/**
   * Remove o primeiro elemento-filho do scroll
   */

	}, {
		key: '_pop',
		value: function _pop() {
			if (this._scroll.childNodes.length) {
				var elem = this._scroll.childNodes[0];
				if (this._manterPosicao) this._scroll.scrollTop -= elem.offsetHeight;
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
				    top = this._scroll.scrollTop;
				if (this._scroll.scrollTop < 0) {
					top = 0;
					dif = this._scroll.scrollTop;
				} else if (this._scroll.scrollTop + this._scroll.offsetHeight > this._scroll.scrollHeight) {
					dif = this._scroll.scrollHeight - (this._scroll.scrollTop + this._scroll.offsetHeight);
				}

				//checando se existe scroll
				var fator = this._scroll.offsetHeight / this._scroll.scrollHeight;
				if (fator < 1) {
					var altura = Math.floor(this._scroll.offsetHeight * fator);
					this._scrollbarVertical.style.display = '';
					this._scrollbarVertical.style.height = altura + dif + 'px';
					this._scrollbarVertical.style.top = top / (this._scroll.scrollHeight - dif - this._scroll.offsetHeight) * (this._scroll.offsetHeight - altura - dif) + 'px';
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
				if (_fator < 1) {
					var _altura = Math.floor(this._scroll.offsetWidth * _fator);
					this._scrollbarHorizontal.style.display = '';
					this._scrollbarHorizontal.style.width = _altura + _dif + 'px';
					this._scrollbarHorizontal.style.left = _top / (this._scroll.scrollWidth - _dif - this._scroll.offsetWidth) * (this._scroll.offsetWidth - _altura - _dif) + 'px';
				} else this._scrollbarHorizontal.style.display = 'none';
			}
		}

		/**
   * Inicia o tratamento de arrasto do scrollbar
   *
   * @param {MouseEvent} e - Evento do mouse
   * @param {boolean} vertical - Indica se o scroll é vertical ou horizontal
   */

	}, {
		key: '_scrollbarStart',
		value: function _scrollbarStart(e, vertical) {
			var _this2 = this;

			var elem = void 0,
			    start = void 0,
			    top = void 0,
			    max = void 0,
			    attr = void 0,
			    attrScroll = void 0,
			    coord = void 0,
			    dif = void 0;

			if (vertical) {
				elem = this._scrollbarVertical;
				start = !e.touches ? e.clientY : e.touches[0].clientY;
				top = elem.offsetTop;
				max = this._scroll.offsetHeight - elem.offsetHeight;
				attr = 'top';
				attrScroll = 'scrollTop';
				coord = 'clientY';
				dif = this._scroll.scrollHeight - this._scroll.offsetHeight;
			} else {
				elem = this._scrollbarHorizontal;
				start = !e.touches ? e.clientX : e.touches[0].clientX;
				top = elem.offsetLeft;
				max = this._scroll.offsetWidth - elem.offsetWidth;
				attr = 'left';
				attrScroll = 'scrollLeft';
				coord = 'clientX';
				dif = this._scroll.scrollWidth - this._scroll.offsetWidth;
			}

			var move = function move(e) {
				var pos = top + (!e.touches ? e[coord] : e.touches[0][coord]) - start;
				if (pos < 0) pos = 0;else if (pos > max) pos = max;

				elem.style[attr] = pos + 'px';
				_this2._scroll[attrScroll] = dif * pos / max;
				e.stopPropagation();
				e.preventDefault();
			};
			var end = function end() {
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

	}, {
		key: '_sombras',
		value: function _sombras() {
			var classes = [];

			if (this._classInit) classes.push(this._classInit);

			var fim = this._checkFim();

			//baixo
			if (!fim) {
				if (this._classes) {
					if (this._scroll.scrollTop === 0) classes.push(this._classes[2]);
					//topo baixo
					else if (this._scroll.scrollTop > 0) classes.push(this._classes[1]);
				}
			} else {
				//topo
				if (this._classes && this._scroll.scrollTop > 0) classes.push(this._classes[0]);

				//emitindo evento do final do scroll
				_get(Scroll.prototype.__proto__ || Object.getPrototypeOf(Scroll.prototype), 'emit', this).call(this, 'fim');
			}

			this._elem.className = classes.join(' ');
		}

		/**
   * Adiciona um elemento ao scroll
   *
   * @param {HTMLElement} elem - Elemento a ser adicionado
   */

	}, {
		key: 'append',
		value: function append(elem) {
			var fim = this._checkFim();

			//mantando quantidade de elementos fixa
			if (this._elementosMax && this._scroll.childNodes.length >= this._elementosMax) this._pop();
			this._scroll.appendChild(elem);

			//mantendo scroll no fim
			if (this._manterPosicao && fim) this.scrollTo(undefined, this._scroll.scrollHeight);else this.refresh();
		}

		/**
   * Atualiza parâmetros do scroll
   */

	}, {
		key: 'refresh',
		value: function refresh() {
			this._scrollbarSize();
			this._sombras();
		}

		/**
   * Move o scroll para um ponto específico
   *
   * @param {number} x - Coordenada X para posicionamento do topo do scroll
   * @param {number} y - Coordenada Y para posicionamento do topo do scroll
   */

	}, {
		key: 'scrollTo',
		value: function scrollTo() {
			var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
			var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

			if (x != -1) this._scroll.scrollLeft = x;
			if (y != -1) this._scroll.scrollTop = y;
		}
	}]);

	return Scroll;
}(Eventos);

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

// Expondo como um modulo common js
if (typeof module !== 'undefined' && module.exports) {
	module.exports = Scroll;
}