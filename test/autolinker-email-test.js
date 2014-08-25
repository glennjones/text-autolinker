'use strict';

var chai			= require('chai'),
	assert			= chai.assert,
	autolinker      = require('../lib/autolinker');

// units tests for email parsing autolinker.js 
// the module email-address has a major test suite based on https://github.com/dominicsayers/isemail

describe('autolinker-email', function(){



	it('example@gmail.com', function(done){
		var options = {
			text: 'example@gmail.com'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, '<a class=\"auto-link u-email\" href=\"mailto:example@gmail.com\">example@gmail.com</a>', 'should convert to html');
			assert.equal(result.email[0].address, 'example@gmail.com', 'should find email address');
			assert.equal(result.email[0].local, 'example', 'should find email address local');
			assert.equal(result.email[0].domain, 'gmail.com', 'should find email address domain');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});

	it('exam-ple@gmail.com', function(done){
		var options = {
			text: 'exam-ple@gmail.com'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, '<a class=\"auto-link u-email\" href=\"mailto:exam-ple@gmail.com\">exam-ple@gmail.com</a>', 'should convert to html');
			assert.equal(result.email[0].address, 'exam-ple@gmail.com', 'should find email address');
			assert.equal(result.email[0].local, 'exam-ple', 'should find email address local');
			assert.equal(result.email[0].domain, 'gmail.com', 'should find email address domain');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});

	it('joe.bloggs@gmail.com', function(done){
		var options = {
			text: 'joe.bloggs@gmail.com'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, '<a class=\"auto-link u-email\" href=\"mailto:joe.bloggs@gmail.com\">joe.bloggs@gmail.com</a>', 'should convert to html');
			assert.equal(result.email[0].address, 'joe.bloggs@gmail.com', 'should find email address');
			assert.equal(result.email[0].local, 'joe.bloggs', 'should find email address local');
			assert.equal(result.email[0].domain, 'gmail.com', 'should find email address domain');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('joe.bloggs@example', function(done){
		var options = {
			text: 'joe.bloggs@example'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, '<a class=\"auto-link u-email\" href=\"mailto:joe.bloggs@example\">joe.bloggs@example</a>', 'should convert to html');
			assert.equal(result.email[0].address, 'joe.bloggs@example', 'should find email address');
			assert.equal(result.email[0].local, 'joe.bloggs', 'should find email address local');
			assert.equal(result.email[0].domain, 'example', 'should find email address domain');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	
});