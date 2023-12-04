'use strict';

var chai			= require('chai'),
	assert			= chai.assert,
	autolinker      = require('../lib/autolinker');

// units tests autolinker.js options

describe('autolinker', function(){

	this.timeout(10000); // 10 seconds getting expanded urls can take time


	it('custom classes', function(done){
		var options = {
			text: '@t does #css http://bit.ly/1pFTBaw - pic.twitter.com/FzYI36MKFN - vine.co/v/b55LOA1dgJU',
			className: {
				auto: 'test-01',
				username: 'test-02',
				tag: 'test-03',
				photo: 'test-04',
				video: 'test-05',
				url: 'test-06',
				email: 'test-07'
			}
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, '<a class="test-01 test-02" href="https://twitter.com/t">&#x40;t</a> does <a class="test-01 test-03" href="https://twitter.com/search?q=#css&amp;src=hash">&#x23;css</a> <a class="test-01 test-06" href="https://glennjones.net/articles/2014-08-19-manifesto-for-transmit">https://glennjones.net/articles/2014-08-19-manifesto-for-transmit</a> - <a class="test-01 test-04" href="https://twitter.com/adactio/status/501407682558177282/photo/1">https://twitter.com/adactio/status/501407682558177282/photo/1</a> - <a class="test-01 test-05" href="https://vine.co/v/b55LOA1dgJU">vine.co&#x2f;v&#x2f;b55LOA1dgJU</a>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('no url expanding', function(done){
		var options = {
			text: 'no need to expand http://bit.ly/1pFTBaw',
			expandUrls: false
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'no need to expand <a class=\"auto-link u-url\" href=\"http://bit.ly/1pFTBaw\">http://bit.ly/1pFTBaw</a>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('escape html tags', function(done){
		var options = {
			text: '<p>html tags</p></br>',
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, '&lt;p&gt;html tags&lt;&#x2f;p&gt;&lt;&#x2f;br&gt;', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('does NOT escape html tags', function(done){
		var options = {
			text: '<p>html tags</p></br>',
			escapeHtml: false
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, '<p>html tags</p></br>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});





});