'use strict';

import 'babel-polyfill';
import Scroll from '../../src/scroll.js';

var elem = document.getElementById('container');
var scroll = new Scroll(elem,{
	classes: ['sombra-top','sombra-middle','sombra-bottom'],
	manterPosicao: true,
	elementosMax: 40,
	scrollVertical: true,
	tolerancia: 20
});
var logElem = document.getElementById('fim');
scroll.on('inicio', function () {
	logElem.innerHTML = `Inicio da rolagem (${Date.now()})<br />${logElem.innerHTML}`;
});
scroll.on('fim', function () {
	logElem.innerHTML = `Fim da rolagem (${Date.now()})<br />${logElem.innerHTML}`;
});
scroll.on('moveu', function (dados) {
	dados = JSON.stringify(dados);
	logElem.innerHTML = `Movimento realizado (${dados})<br />${logElem.innerHTML}`;
});

document.getElementById('add').addEventListener('click',function () {
	var textoElem = document.createElement('div');
	textoElem.innerText = 'Novo';

	scroll.append(textoElem);
},false);
document.getElementById('final').addEventListener('click',function () {
	scroll.scrollEnd(false, true);
},false);
