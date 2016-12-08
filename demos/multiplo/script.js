'use strict';

var elem = document.getElementById('container');
var scroll = new Scroll(elem,{
	scrollVertical: true,
	scrollHorizontal: true,
	margemVertical: [0,10],
	margemHorizontal: [0,10]
});
var tamanho = 400;

document.getElementById('aumentar').addEventListener('click', function() {
	var elem = document.getElementById('elemento');
	tamanho += 100;
	elem.style.width = tamanho + 'px';
	elem.style.height = tamanho + 'px';
	scroll.refresh();
},false);

document.getElementById('diminuir').addEventListener('click', function() {
	var elem = document.getElementById('elemento');
	tamanho -= 100;
	elem.style.width = tamanho + 'px';
	elem.style.height = tamanho + 'px';
	scroll.refresh();
},false);
