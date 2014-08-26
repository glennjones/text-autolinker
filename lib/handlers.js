
'use strict';
var fs				= require('fs'),
	path            = require('path'),
	hapi            = require('hapi'),
	config          = require('../config.js'),
	pack            = require('../package'),
	autolinker      = require('../lib/autolinker.js'),
	utils           = require('../lib/utilities.js');
	

// refines configure using server context
config = utils.processConfig( config );


function index(request, reply) {
	utils.getMarkDownHTML(__dirname.replace('/lib','') + '/README.md', function(err, data){
		reply.view('swagger.html', {
			title: pack.name,
			basepath: (config.server.basepath)? config.server.basepath + '/' : '/',
			markdown: data
		});
	});
}


function parse (request, reply) { 
	var options = {
		text: request.query.text
	};
	if(request.query.publisheddate !== undefined){
		options.publishedDate = request.query.publisheddate;
	}
	if(request.query.escapehtml !== undefined){
		options.escapeHtml = request.query.escapehtml
	}
	if(request.query.expandurls !== undefined){
		options.expandUrls = request.query.expandurls
	}
	if(request.query.parsedates !== undefined){
		options.parseDates = request.query.parsedates
	}

	autolinker.parse( options, function( err, result ){
		renderJSON( request, reply, err, result );
	}); 
}



// render json out to http stream
function renderJSON( request, reply, err, result ){
	if(err){
		if(err.code === 404){
			reply(new hapi.error.notFound(err.message));
		}else{
			reply(new hapi.error.badRequest(err.message));
		}
	}else{
		reply(result).type('application/json; charset=utf-8');
	}
}


exports.index = index;
exports.parse = parse;






