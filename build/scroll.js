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
  */
	function Scroll(elem) {
		var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var manterPosicao = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
		var elementosMax = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

		_classCallCheck(this, Scroll);

		var _this = _possibleConstructorReturn(this, (Scroll.__proto__ || Object.getPrototypeOf(Scroll)).call(this));

		_this._elem = elem;
		_this._scroll = elem.querySelector('div');
		_this._classes = classes;
		_this._manterPosicao = manterPosicao;
		_this._elementosMax = elementosMax;

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

		_this._scroll.addEventListener('scroll', function () {
			_this._sombras();
		}, false);

		//inicializando sombras
		_this._sombras();
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
			if (this._manterPosicao && fim) this._scroll.scrollTop = this._scroll.scrollHeight;

			this._sombras();
		}

		/**
   * Move o scroll para um ponto específico
   *
   * @param {number} y - Coordenada Y para posicionamento do topo do scroll
   */

	}, {
		key: 'scrollTo',
		value: function scrollTo(y) {
			this._scroll.scrollTop = y;
			this._sombras();
		}
	}]);

	return Scroll;
}(Eventos);

// Expondo como um modulo common js


if (typeof module !== 'undefined' && module.exports) {
	module.exports = Scroll;
}