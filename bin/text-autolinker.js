'use strict';
var hapi            = require('hapi'),
    swagger         = require('hapi-swagger'),
    pack            = require('../package'),
    config          = require('../config.js'),
    utils           = require('../lib/utilities.js'),
    routes          = require('../lib/routes.js');
 

// refines configure using server context
config = utils.processConfig( config )




var serverOptions = {
    views: {
        path: __dirname.replace('/bin','') + '/templates',
        engines: { html: 'handlebars' },
        partialsPath: __dirname.replace('/bin','') + '/templates/withPartials',
        helpersPath: __dirname.replace('/bin','') + '/templates/helpers',
        isCached: false
    },
    maxSockets: 500,
    cors: true
};



var server = hapi.createServer(config.server.host, config.server.port, serverOptions);

server.route(routes.routes);


server.start(function(){
    console.log(['start'], pack.name + ' - web interface: ' + server.info.uri);
});


// setup swagger options
var swaggerOptions = {
    basePath: 'http://' + config.server.host + ':' + config.server.port,
    apiVersion: pack.version
};
if(config.server.basepath){
    swaggerOptions.basePath = config.server.basepath;
    console.log(['start'], config.server.basepath);
}


// adds swagger self documentation plugin
server.pack.require({'hapi-swagger': swaggerOptions}, function (err) {
    console.log(['start'], 'swagger interface loaded')
});

 





