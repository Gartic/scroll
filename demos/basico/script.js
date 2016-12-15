'use strict';

import Scroll from '../../src/scroll.js';

var elem = document.getElementById('container');
var scroll = new Scroll(elem,{
	classes: ['sombra-top','sombra-middle','sombra-bottom'],
	manterPosicao: true,
	elementosMax: 40,
	scrollVertical: true,
	tolerancia: 20
});
scroll.on('inicio', function () {
	document.getElementById('fim').innerText = `Inicio da rolagem (${Date.now()})`;
});
scroll.on('fim', function () {
	document.getElementById('fim').innerText = `Fim da rolagem (${Date.now()})`;
});

document.getElementById('add').addEventListener('click',function () {
	var textoElem = document.createElement('div');
	textoElem.innerText = 'Novo';

	scroll.append(textoElem);
},false);
document.getElementById('final').addEventListener('click',function () {
	scroll.scrollEnd(false, true);
},false);
