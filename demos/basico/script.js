'use strict';

let elem = document.getElementById('container');
let scroll = new Scroll(elem,['sombra-top','sombra-middle','sombra-bottom'],true,25);
scroll.on('fim', () => {
	document.getElementById('fim').innerText = `Fim da rolagem (${Date.now()})`;
});

document.getElementById('add').addEventListener('click',() => {
	let textoElem = document.createElement('div');
	textoElem.innerText = 'Novo';

	scroll.append(textoElem);
},false);
