'use strict';
var marked		= require('marked'),
	hoek		= require('hoek'),
	fs			= require('fs');


module.exports = {


	// refines configure using server context
	processConfig: function(config) {
		// get the options for the right server setup
		var out = {},
			serverMode = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

		// loop object properties and add them to root of out object
		for (var key in config.environments[serverMode]) {
			if (config.environments[serverMode].hasOwnProperty(key)) {
				out[key] = config.environments[serverMode][key];
			}
		}

		if (process.env.HOST) {
			out.server.host = process.env.HOST;
		}
		if (process.env.PORT) {
			out.server.port = parseInt(process.env.PORT, 10);
		}


		// add modulus information
		if (process.env.SERVO_ID && process.env.CLOUD_DIR) {
			this.host = this.host ? this.host : {};
			this.host.clouddir = process.env.CLOUD_DIR;
			this.host.servoid = process.env.SERVO_ID;
		}


		return out;
	},


	// read a file and converts the markdown to HTML
	getMarkDownHTML: function(path, callback) {
		fs.readFile(path, 'utf8', function(err, data) {
			if (!err) {
				marked.setOptions({
					gfm: true,
					tables: true,
					breaks: false,
					pedantic: false,
					sanitize: true,
					smartLists: true,
					smartypants: false,
					langPrefix: 'language-',
					highlight: function(code, lang) {
						return code;
					}
				});
				data = marked(data);
			}
			callback(err, data);
		});
	},

	isString: function (obj) {
    	return typeof (obj) == 'string';
	},


	// trim whitespace from text
	trim: function ( str ) {
		return str.replace(/^\s+|\s+$/g, '');
	},



	// return error object
	buildError: function(code, err, message) {
		code = (code || isNaN(code)) ? code : 500;
		err = (err) ? err : '';
		message = (message) ? message : '';

		return {
			'code': code,
			'error': err,
			'message': message
		};
	},


	// simple function to find out if a object has any properties. 
	hasProperties: function(obj) {
		var key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				return true;
			}
		}
		return false;
	},


	// abstracts hoek applyToDefaults
	applyToDefaults: function(defaults, options) {
		return hoek.applyToDefaults(defaults, options);
	},

	// abstracts hoek escapeHtml
	escapeHtml: function(text) {
		return hoek.escapeHtml(text);
	}



};