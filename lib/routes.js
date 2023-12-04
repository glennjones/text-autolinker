'use strict';
const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const handlers = require('../lib/handlers.js');
let routes;

// adds the routes and validation for api
routes = [{
	method: 'GET',
	path: '/',
	handler: handlers.index,
	options: {}
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
	handler: handlers.parse,
	options: {
		description: 'Parse HTML from text',
		notes: 'Turns text into html by adding links. If a publishedDate is not supplied current date and time will be used.',
		tags: ['api'],
		validate: {
			query: Joi.object({
				text: Joi.string()
					.required()
					.description('a text string to convert to html'),
				parsedates: Joi.boolean()
					.optional()
					.description('escape html characters - default: true'),
				publisheddate: Joi.string()
					.optional()
					.description('a ISO datetime text string with timezone'),
				escapehtml: Joi.boolean()
					.optional()
					.description('escape html characters - default: true'),
				expandurls: Joi.boolean()
					.optional()
					.description('expand shorten or redirected urls - default: true'),
			})
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