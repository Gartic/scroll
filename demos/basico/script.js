'use strict';

var elem = document.getElementById('container');
var scroll = new Scroll(elem,{
	classes: ['sombra-top','sombra-middle','sombra-bottom'],
	manterPosicao: true,
	elementosMax: 40,
	scrollVertical: true,
	margemVertical: 5
});
scroll.on('fim', function () {
	document.getElementById('fim').innerText = `Fim da rolagem (${Date.now()})`;
});

document.getElementById('add').addEventListener('click',function () {
	var textoElem = document.createElement('div');
	textoElem.innerText = 'Novo';

	scroll.append(textoElem);
},false);
