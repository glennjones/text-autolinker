'use strict';

var chai			= require('chai'),
	assert			= chai.assert,
	autolinker      = require('../lib/autolinker');

// units tests twitter elements autolinker.js

describe('autolinker', function(){

	this.timeout(10000); // 10 seconds getting expanded urls can take time


	it('convert hastag', function(done){
		var options = {
			text: 'I like #html #javascript #css and #indieweb',
		};
		autolinker.parse(options, function(err, result){
			//console.log(result.html)
			assert.equal(result.html, 'I like <a class=\"auto-link p-category\" href=\"https://twitter.com/search?q=#html&amp;src=hash\">&#x23;html</a> <a class=\"auto-link p-category\" href=\"https://twitter.com/search?q=#javascript&amp;src=hash\">&#x23;javascript</a> <a class=\"auto-link p-category\" href=\"https://twitter.com/search?q=#css&amp;src=hash\">&#x23;css</a> and <a class=\"auto-link p-category\" href=\"https://twitter.com/search?q=#indieweb&amp;src=hash\">&#x23;indieweb</a>', 'should convert to html');
			assert.equal(result.category[0], 'html', 'should extract html hashtag');
			assert.equal(result.category[3], 'indieweb', 'should extract indieweb hashtag');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('convert twitter usernames', function(done){
		var options = {
			text: '@glennjones or @t but not info@transmat.io',
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, '<a class=\"auto-link h-x-username\" href=\"https://twitter.com/glennjones\">&#x40;glennjones</a> or <a class=\"auto-link h-x-username\" href=\"https://twitter.com/t\">&#x40;t</a> but not <a class=\"auto-link u-email\" href=\"mailto:info@transmat.io\">info@transmat.io</a>', 'should convert to html');
			assert.equal(result.account[0].match, '@glennjones', 'should extract username with @');
			assert.equal(result.account[0].username, 'glennjones', 'should extract username');
			assert.equal(result.account[0].domain, 'twitter.com', 'should extract domain');
			assert.equal(result.account.length, 2, 'should only extract 2 accounts');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('convert pic.twitter.com to media entries', function(done){
		var options = {
			text: 'The adventures of @BillT in Brighton. pic.twitter.com/FzYI36MKFN',
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'The adventures of <a class=\"auto-link h-x-username\" href=\"https://twitter.com/BillT\">&#x40;BillT</a> in Brighton. <a class=\"auto-link u-photo\" href=\"https://twitter.com/adactio/status/501407682558177282/photo/1\">https://twitter.com/adactio/status/501407682558177282/photo/1</a>', 'should convert to html');
			assert.equal(result.media[0].match, 'pic.twitter.com/FzYI36MKFN', 'should extract url fragment');
			assert.equal(result.media[0].type, 'image', 'should extract media type image');
			assert.equal(result.media[0].url, 'https://pic.twitter.com/FzYI36MKFN', 'should return full shorten url');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('convert vine.co/v/ to media entries', function(done){
		var options = {
			text: 'mixing gnarly basslines today vine.co/v/b55LOA1dgJU',
			publishedDate: '2014-08-23T11:00:00Z'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'mixing gnarly basslines <time class="auto-date-discovery dt-start" datetime="2014-08-23">today</time> <a class="auto-link u-video" href="https://vine.co/v/b55LOA1dgJU">vine.co&#x2f;v&#x2f;b55LOA1dgJU</a>', 'should convert to html');
			assert.equal(result.media[0].match, 'vine.co/v/b55LOA1dgJU', 'should extract url fragment');
			assert.equal(result.media[0].type, 'video', 'should extract media type image');
			assert.equal(result.media[0].url, 'https://vine.co/v/b55LOA1dgJU', 'should return full shorten url');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});










});