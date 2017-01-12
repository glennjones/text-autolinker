'use strict';

var chai			= require('chai'),
	assert			= chai.assert,
	autolinker      = require('../lib/autolinker');

// units tests auto link of parsed web addresses autolinker.js

describe('autolinker', function(){

	this.timeout(10000); // 10 seconds getting expanded urls can take time


	it('convert words starting with http:// and https://', function(done){
		var options = {
			text: 'http://glennjones.net or https://transmat.io',
			expandUrls: false
		};
		autolinker.parse(options, function(err, result){
			console.log(result.html)
			assert.equal(result.html, '<a class=\"auto-link u-url\" href=\"http://glennjones.net\">http://glennjones.net</a> or <a class=\"auto-link u-url\" href=\"https://transmat.io\">https://transmat.io</a>', 'should convert to html');
			assert.equal(result.url[0].match, 'http://glennjones.net', 'should extract url with http prefix');
			assert.equal(result.url[1].match, 'https://transmat.io', 'should extract url with https prefix');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});




	it('custom url expanding', function(done){
		var options = {
			text: 'these tools where built for transmat.io site',
			urls: [{
				match: 'transmat.io',
				expanded: 'https://transmat.io'
			}]
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'these tools where built for <a class=\"auto-link u-url\" href=\"https://transmat.io\">transmat.io</a> site', 'should convert to html');
			assert.equal(result.url[0].match, 'transmat.io', 'should extract url fragment');
			assert.equal(result.url[0].expanded, 'https://transmat.io', 'should extract media type image');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('custom url that calls to web', function(done){
		var options = {
			text: 'no need to expand http://bit.ly/1pFTBaw',
			urls: [{
				match: 'http://bit.ly/1pFTBaw',
				expanded: 'http://glennjones.net/articles/2014-08-19-manifesto-for-transmat'
			}]
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'no need to expand <a class=\"auto-link u-url\" href=\"http://glennjones.net/articles/2014-08-19-manifesto-for-transmat\">http://glennjones.net/articles/2014-08-19-manifesto-for-transmat</a>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


});