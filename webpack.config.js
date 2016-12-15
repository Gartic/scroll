'use strict';

let config = {
	module: {
		loaders: [{
			test: /.js$/,
			loader: 'babel-loader'
		}]
	}
};

// Demo basico
let basico = Object.assign({
	entry: './demos/basico/script.js',
	output: {
		path: './demos/basico/',
		filename: 'bundle.js'
	}
},config);

// Demo multiplo
let multiplo = Object.assign({
	entry: './demos/multiplo/script.js',
	output: {
		path: './demos/multiplo/',
		filename: 'bundle.js'
	}
},config);

module.exports = [
	basico, multiplo
];
