const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const Blipp = require('blipp');
const HapiSwagger = require('hapi-swagger');
const { swaggerOptions } = require('./swaggerOptions.js');
const { routes } = require('../lib/routes.js');
const utils = require('../lib/utilities.js');
let config = require('../config.js');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3052;

// refines configure using server context
config = utils.processConfig( config )

const serverOptions = {
    host,
    port,
    debug: { request: ['error'] },
    routes: {
        response: {
            modify: true,
        },
        cors: true,
    }
};


(async () => {
    // create server
    const server = new Hapi.Server(serverOptions);
    // add swagger UI plugin
    await server.register([
      Inert,
      Vision,
      Blipp,
      { plugin: HapiSwagger, options: swaggerOptions },
    ]);

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname.replace('/bin', ''),
        path: 'templates',
        partialsPath: 'templates/withPartials',
        helpersPath: 'templates/helpers',
        isCached: false
    });

    // register routes
    server.route(routes);
    // add basic logger
    server.events.on(
      'response',
      ({ info, method, path }) => {
        console.info(`[${info.remoteAddress}] ${method.toUpperCase()}: ${path}`);
      }
    );
    // start server
    await server.start();
    console.info('Server running at:', server.info.uri);
  })();



