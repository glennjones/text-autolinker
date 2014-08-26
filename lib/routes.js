'use strict';
var hapi      = require('hapi'),
	joi       = require('joi'),
	handlers  = require('../lib/handlers.js'),
	routes;


// adds the routes and validation for api
routes = [{
	method: 'GET',
	path: '/',
	config: {
		handler: handlers.index
	}
}, {
	method: 'GET',
	path: '/images/{file*}',
	handler: {
		directory: {
			path: './node_modules/hapi-swagger/public/swaggerui/images'
		}
	}
}, {
	method: 'POST',
	path: '/autolink/text',
	config: {
		handler: handlers.parse,
		description: 'Parse HTML from text',
		notes: 'Turns text into html by adding links. If a publishedDate is not supplied current date and time will be used.',
		tags: ['api'],
		jsonp: 'callback',
		validate: {
			query: {
				text: joi.string()
					.required()
					.description('a text string to convert to html'),
				parsedates: joi.boolean()
					.optional()
					.description('escape html characters - default: true'),
				publisheddate: joi.string()
					.optional()
					.description('a ISO datetime text string with timezone'),
				escapehtml: joi.boolean()
					.optional()
					.description('escape html characters - default: true'),
				expandurls: joi.boolean()
					.optional()
					.description('expand shorten or redirected urls - default: true'),
			}
		}
	}
}, {
	method: 'GET',
	path: '/{path*}',
	handler: {
		directory: {
			path: __dirname.replace('/lib', '') + '/public',
			listing: false,
			index: true
		}
	}
}];


exports.routes = routes;