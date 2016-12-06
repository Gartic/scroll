'use strict';

var elem = document.getElementById('container');
var scroll = new Scroll(elem,false,true,40,true,true);
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
