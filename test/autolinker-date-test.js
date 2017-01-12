'use strict';

var chai			= require('chai'),
	assert			= chai.assert,
	autolinker      = require('../lib/autolinker');

// units tests twitter elements autolinker.js

describe('autolinker-date', function(){

	this.timeout(10000); // 10 seconds getting expanded urls can take time




	/* Fails test after 2014
	it('a set date in "15 May" format', function(done){
		var options = {
			text: 'An appointment on 15 May'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'An appointment on <time class=\"auto-date-discovery dt-start\" datetime=\"2014-05-15\">15 May</time>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});
	*/


	it('a set date in "15 May 2014" format', function(done){
		var options = {
			text: 'An appointment on 15 May 2014'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'An appointment on <time class=\"auto-date-discovery dt-start\" datetime=\"2014-05-15\">15 May 2014</time>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('a set date in "15 Jun 2014" format', function(done){
		var options = {
			text: 'An appointment on 15 Jun 2014'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'An appointment on <time class=\"auto-date-discovery dt-start\" datetime=\"2014-06-15\">15 Jun 2014</time>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('a set date in "Aug 17 2014" format', function(done){
		var options = {
			text: 'An appointment on Aug 17 2014'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'An appointment on <time class=\"auto-date-discovery dt-start\" datetime=\"2014-08-17\">Aug 17 2014</time>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('a set date in "9 May 2014 at 16:10" format', function(done){
		var options = {
			text: 'An appointment on 9 May 2014 at 16:10',
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'An appointment on <time class=\"auto-date-discovery dt-start\" datetime=\"2014-05-09T16:10:00\">9 May 2014 at 16:10</time>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('a set date in "10 May 2014 at 16:10" format', function(done){
		var options = {
			text: 'An appointment on 10 May 2014 at 16:10',
			publishedDate: '2012-07-23T00:00+02:00'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'An appointment on <time class=\"auto-date-discovery dt-start\" datetime=\"2014-05-10T16:10:00+02:00\">10 May 2014 at 16:10</time>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});

	it('a set date in "13 May 2014 at 16:10 EDT" format', function(done){
		var options = {
			text: 'An appointment on 13 May 2014 at 16:10 EDT',
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'An appointment on <time class=\"auto-date-discovery dt-start\" datetime=\"2014-05-13T16:10:00-04:00\">13 May 2014 at 16:10 EDT</time>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});



	it('today with publishedDate set to 2012-07-23T00:00:00Z : note month 0-11', function(done){
		var options = {
			text: 'An appointment on today',
			publishedDate: '2012-07-23T00:00:00Z'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'An appointment on <time class=\"auto-date-discovery dt-start\" datetime=\"2012-07-23\">today</time>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('yesterday with publishedDate set to 2012-07-23T00:00:00Z : note month 0-11', function(done){
		var options = {
			text: 'An appointment on yesterday',
			publishedDate: '2012-07-23T00:00:00Z'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'An appointment on <time class=\"auto-date-discovery dt-start\" datetime=\"2012-07-22\">yesterday</time>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('tomorrow with publishedDate set to 2012-07-23T00:00:00Z : note month 0-11', function(done){
		var options = {
			text: 'An appointment on tomorrow',
			publishedDate: '2012-07-23T11:00:00Z'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'An appointment on <time class=\"auto-date-discovery dt-start\" datetime=\"2012-07-24\">tomorrow</time>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('this Monday with reference date ref set to 2012-07-23T00:00:00Z : note month 0-11', function(done){
		var options = {
			text: 'An appointment on this Monday',
			publishedDate: '2012-07-23T00:00:00Z'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, 'An appointment on <time class=\"auto-date-discovery dt-start\" datetime=\"2012-07-23\">this Monday</time>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('today with reference date ref set to 2012-01-01', function(done){
		var options = {
			text: 'today',
			publishedDate: '2012-01-01'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, '<time class=\"auto-date-discovery dt-start\" datetime=\"2012-01-01\">today</time>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('tonight with reference date ref set to 2012-01-01', function(done){
		var options = {
			text: 'tonight',
			publishedDate: '2012-01-01'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, '<time class=\"auto-date-discovery dt-start\" datetime=\"2012-01-01\">tonight</time>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});


	it('tomorrow at 4:15 with reference date ref set to 2012-01-01', function(done){
		var options = {
			text: 'tomorrow at 4:15',
			publishedDate: '2012-01-01'
		};
		autolinker.parse(options, function(err, result){
			assert.equal(result.html, '<time class=\"auto-date-discovery dt-start\" datetime=\"2012-01-02T04:15:00\">tomorrow at 4:15</time>', 'should convert to html');
			assert.equal(err, null, 'should excute without error');
			done();
		});
	});





});