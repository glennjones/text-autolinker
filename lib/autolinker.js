'use strict';
var async		= require('async'),
	chrono		= require('chrono-node'),
	moment		= require('moment'),
	addrs		= require('email-addresses'),
	validUrl	= require('valid-url'),
	expand		= require('./expand'),
	utils		= require('./utilities.js');



var	defaultOptions = {
		className: {
			auto: 'auto-link',
			date: 'auto-date-discovery dt-start',
			username: 'h-x-username',
			tag: 'p-category',
			photo: 'u-photo',
			video: 'u-video',
			url: 'u-url',
			email: 'u-email'
		},
		escapeHtml: true,
		expandUrls: true,
		parseDates: true,
		urls: [{
			match: 'transmat.io',
			expanded: 'https://transmat.io'
		}],
		transformFunction: {

			link: function ( word, data ){

				return'<a class="' + data.classes + '" href="' + data.address + '">' + data.address + '</a>';
			},

			mention: function ( word, data ){

				return '<a class="' + data.classes + '" href="' + data.urlStart + word.replace('@', '') + '">' + escapeHtml(word, {escapeHtml: data.escapeHtml}) + '</a>';
			},

			hash: function( word, data ){

				return '<a class="' + data.classes + '" href="' + data.urlStart + word + data.urlEnd + '">' + escapeHtml(word, {escapeHtml: data.escapeHtml}) + '</a>';
			}
		}

	};





function parse(options, callback) {
	// merge options
	options = utils.applyToDefaults(defaultOptions, options);

	if (options.expandUrls) {
		parseUrls(options.text, options, function(err, urls) {
			async.each(urls, function(urlObj, callback) {

				var extended = getExpandedUrl(urlObj.url, options);
				// if its not already resolved
				if (!extended) {
					expand(urlObj.url, function(err, data) {
						//console.log(JSON.stringify(data));
						if (data && data.url && data.tracks && data.tracks[0]) {
							options.urls.push({
								'match': data.tracks[0].url,
								'expanded': data.url
							});
						} else {
							console.log('url expand failed: ', JSON.stringify(data));
						}
						// never fail so that all urls are expanded
						callback(null, true);
					});
				} else {
					callback(null, true);
				}
			}, function(err) {
				// call even on err
				parseText(options.text, options, function(err, result) {
					callback(err, result);
				});
			});

		});
	} else {
		parseText(options.text, options, function(err, result) {
			callback(err, result);
		});
	}
}

function escapeHtml(text, options) {
	if (options.escapeHtml === true) {
		return utils.escapeHtml(text);
	}
	return text;
}



// parse the text and create a HTML string
function parseText(text, options, callback) {
	var out = {
			html: ''
		},
		expanded,
		words,
		x = 0,
		i;

	// is a text string
	if (text && utils.isString(text) && text !== '') {

		// break texts into words
		words = [text];
		if (text.indexOf(' ') > -1) {
			words = text.split(' ');
		}

		// add html links
		i = words.length;
		while (x < i) {
			var cn = options.className,
				word = utils.trim(words[x]);

			// the . is not need for valid url, but is inforced here
			if (word.indexOf('http:') === 0 || word.indexOf('https:') === 0 && word.indexOf('.') > 0) {

				// check url is valid
				if (validUrl.isUri(word)) {
					if (!out.url) {
						out.url = [];
					}
					expanded = getExpandedUrl(word, options);
					var address = word;
					if (expanded) {
						address = expanded;
						out.url.push({
							match: word,
							expanded: expanded
						});
					} else {
						out.url.push({
							match: word
						});
					}
					words[x] = options.transformFunction.link(word, {
						classes: cn.auto + ' ' + cn.url,
						address: address,
					})
					//words[x] = '<a class="' + cn.auto + ' ' + cn.url + '" href="' + address + '">' + address + '</a>';
				}



			} else if (word.indexOf('@') > 0 && word.indexOf('.') > 0) {

				// check email is valid
				var email = addrs.parseOneAddress(word);
				if (email) {
					delete email.parts;
					delete email.name;
					if (!out.email) {
						out.email = [];
					}
					out.email.push(email);
					words[x] = '<a class="' + cn.auto + ' ' + cn.email + '" href="mailto:' + email.address + '">' + word + '</a>';
				}

			} else if (word.indexOf('@') === 0) {

				if (!out.account) {
					out.account = [];
				}
				out.account.push({
					match: word,
					username: word.replace('@', ''),
					domain: 'twitter.com'
				});
				//words[x] = '<a class="' + cn.auto + ' ' + cn.username + '" href="https://twitter.com/' + word.replace('@', '') + '">' + escapeHtml(word, options) + '</a>';
				words[x] = options.transformFunction.mention( word, {
					classes: cn.auto + ' ' + cn.username,
					urlStart: 'https://twitter.com/',
					escapeHtml: options.escapeHtml
				})

			} else if (word.indexOf('#') === 0) {

				if (!out.category) {
					out.category = [];
				}
				out.category.push(word.replace(/#/g, '').toLowerCase());
				//words[x] = '<a class="' + cn.auto + ' ' + cn.tag + '" href="https://twitter.com/search?q=' + word + '&amp;src=hash">' + escapeHtml(word, options) + '</a>';
				words[x] = options.transformFunction.hash( word, {
					classes: cn.auto + ' ' + cn.tag,
					urlStart: 'https://twitter.com/search?q=',
					urlEnd: '&amp;src=hash',
					escapeHtml: options.escapeHtml
				})

			} else if (word.indexOf('pic.twitter.com/') === 0) {

				if (!out.media) {
					out.media = [];
				}
				expanded = getExpandedUrl('https://' + word, options);
				out.media.push({
					match: word,
					type: 'image',
					url: 'https://' + word,
					expanded: expanded
				});
				words[x] = '<a class="' + cn.auto + ' ' + cn.photo + '" href="' + expanded + '">' + expanded + '</a>';


			} else if (word.indexOf('vine.co/v/') === 0) {

				if (!out.media) {
					out.media = [];
				}
				out.media.push({
					match: word,
					type: 'video',
					url: 'https://' + word
				});
				words[x] = '<a class="' + cn.auto + ' ' + cn.video + '" href="https://' + word + '">' + escapeHtml(word, options) + '</a>';


			} else {
				expanded = getExpandedUrl(word, options);
				if (expanded) {
					if (!out.url) {
						out.url = [];
					}
					out.url.push({
						match: word,
						expanded: expanded
					});
					words[x] = '<a class="' + cn.auto + ' ' + cn.url + '" href="' + expanded + '">' + escapeHtml(word, options) + '</a>';
				} else {
					words[x] = escapeHtml(word, options);
				}
			}
			x++;
		}
		out.html = words.join(' ');
		if(options.parseDates){
			out = addTimeTags(out, options);
		}

	}
	callback(null, out);

}



// parse the text for urls
function parseUrls(text, options, callback) {
	var urls = [],
		words,
		x = 0,
		i;

	// is a text string
	if (text && utils.isString(text) && text !== '') {

		// break texts into words
		words = [text];
		if (text.indexOf(' ') > -1) {
			words = text.split(' ');
		}

		// finds urls in text
		i = words.length;
		while (x < i) {
			var word = utils.trim(words[x]);

			if (word.indexOf('http:') === 0 || word.indexOf('https:') === 0) {
				urls.push({
					match: word,
					url: word
				});

			} else if (word.indexOf('pic.twitter.com/') === 0) {
				urls.push({
					match: word,
					url: 'https://' + word
				});

			} else if (word.indexOf('vine.co/v/') === 0) {
				urls.push({
					match: word,
					url: 'https://' + word
				});

			}
			x++;
		}

	}
	callback(null, urls);
}


// gets exteneded urls from options.urls array
function getExpandedUrl(url, options) {
	var x = 0,
		i;
	if (options.urls) {
		i = options.urls.length;
		while (x < i) {
			if (options.urls[x].match === url) {
				if (options.urls[x].expanded) {
					return options.urls[x].expanded;
				}
				return null;
			}
			x++;
		}
	}
	return null;
}


// parses text for date string and adds <time> tag
function addTimeTags(obj, options) {
	var data,
		iso,
		cn = options.className,
		restictedWords = ['today', 'tomorrow', 'yesterday'],
		tag = '',
		date = '',
		x = 0,
		i;


	if (options.publishedDate) {
		data = chrono.parse(options.text, options.publishedDate);
	} else {
		data = chrono.parse(options.text);
	}

	//console.log(JSON.stringify(data))

	if (data.length > -1) {
		i = data.length;
		while (x < i) {

			date = data[x].startDate;

			// do not use:
			// impliedComponents for day, month
			// text containing today, tomorrow, yesterday

			if (!data[x].start.impliedComponents) {
				data[x].start.impliedComponents = [];
			}

			if (options.publishedDate || (
				data[x].start.impliedComponents.indexOf('day') === -1 && data[x].start.impliedComponents.indexOf('month') === -1 && constainRestrictedWords(data[x].text) === false
			)) {



				if (data[x].start.timezoneOffset) {
					// add timezone text parse to text based local time
					iso = buildISOLocalDate(data[x].start) + moment('2014-01-01:00:00:00').zone(data[x].start.timezoneOffset).format('Z');
				} else {
					if (options.publishedDate && moment.parseZone(options.publishedDate).zone() !== 0) {
						// add timezone from to publishedDate to text based local time
						iso = buildISOLocalDate(data[x].start) + moment.parseZone(options.publishedDate).format('Z');
					} else {
						// localtime
						iso = buildISOLocalDate(data[x].start);
					}
				}

				// correct tomorrow issue
				if(data[x].text.toLowerCase().indexOf('tomorrow') > -1){
					var today = new Date(options.publishedDate);
					today.setDate(today.getDate() + 1);
					// correct data
					data[x].start.year = today.getFullYear();
					data[x].start.month = today.getMonth();
					data[x].start.day = today.getDate();
					data[x].startDate = today.toISOString();
					// correct iso
					iso = buildISOLocalDate(data[x].start);
				}

				// correct tonight issue
				if(data[x].text.toLowerCase().indexOf('tonight') > -1){
					var today = new Date(options.publishedDate);
					// correct data
					data[x].start.year = today.getFullYear();
					data[x].start.month = today.getMonth();
					data[x].start.day = today.getDate();
					data[x].startDate = today.toISOString();
					// correct iso
					iso = buildISOLocalDate(data[x].start);
				}


				// return only date element if we do not have a time
				if (!data[x].start.hour) {
					iso = iso.split('T')[0];
				}

				tag = '<time class="' + cn.date + '" datetime="' + iso + '">' + data[x].text + '</time>';
				obj.html = obj.html.replace(data[x].text, tag);

			}

			// remove unneeded data
			delete data[x].concordance;
			delete data[x].index;
			if (!utils.hasProperties(data[x].start.impliedComponents)) {
				delete data[x].start.impliedComponents;
			}

			x++;
		}

		if (data.length > 0) {
			if (!obj.time) {
				obj.time = [];
			}
			obj.time = data;
		}

	}



	return obj;
}



// list of words not to let the parser use
// stops praser returning implied dates against server local time
function constainRestrictedWords(text) {
	var i,
		restictedWords = ['today', 'tomorrow', 'yesterday', 'tonight'];

	text = text.toLowerCase();
	i = restictedWords.length;
	while (i--) {
		if (text.indexOf(restictedWords[i]) > -1) {
			return true;
		}
	}
	return false;
}


// builds a local date parsed from text, with no ref to server time
function buildISOLocalDate (date) {
	var out;
	if (date.year !== undefined) {
		out = date.year;
	}
	if (date.month !== undefined) {
		out += '-' + pad(date.month + 1);
	}
	if (date.day !== undefined) {
		out += '-' + pad(date.day);
	}
	if (date.hour !== undefined) {
		out += 'T' + pad(date.hour);
	}
	if (date.minute !== undefined) {
		out += ':' + pad(date.minute);
	}
	if (date.second !== undefined) {
		out += ':' + pad(date.second);
	}
	return out;

	function pad(number) {
		if (number < 10) {
			return '0' + number;
		}
		return number;
	}

}


exports.parse = parse;
exports.escapeHtml = escapeHtml;
exports.parseText = parseText;
exports.parseUrls = parseUrls;
exports.getExpandedUrl = getExpandedUrl;
exports.addTimeTags = addTimeTags;
exports.constainRestrictedWords = constainRestrictedWords;
exports.buildISOLocalDate = buildISOLocalDate;



