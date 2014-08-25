
'use strict';


if(require.main === module) { 
	// if they want the app
    var app = require('../bin/text-autolinker');
}else{ 
	// if they want a module interface
	var routes = require('../lib/routes'),
		autolinker = require('../lib/autolinker.js');

	module.exports = {
		'routes': routes.routes,
		'parse': autolinker.parse
	};
}