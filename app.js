
'use strict';

var http        = require('http');
var express     = require('express');
var path        = require('path');
var favicon     = require('serve-favicon');
var logger      = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// https://www.npmjs.com/package/express-session
var session        = require('express-session');

var methodOverride = require('method-override');
var path           = require('path');
var config         = require('./config');
var numCPUs        = require('os').cpus().length;
var tokenAuth      = require('./components/tokenAuth');
var configServices = require('./configServices');
var configRoutes   = require('./configRoutes');
var cluster        = require('cluster');
var serveStatic    = require('serve-static');

var workerCount    = numCPUs;
var isClusterOn = true;
var app = express();

// Globals
app.set('config', config);
app.set('port', process.env.NODE_WWW_PORT || 8080);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', serveStatic(path.join(__dirname, '/assets')));


// session management
app.use( cookieParser(config.secretKey) );
app.use( tokenAuth.middleware() );

// Data services
configServices(app);


// Enable CORS
app.use( function( req, res, next ) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS' );
    res.header('Access-Control-Allow-Credentials', true );
    res.header('Access-Control-Max-Age', '1000000000' );

    next();

});

// Disable cache for xhr requests
app.use( function( req, res, next ) {
    if ( req.xhr ) {
        res.header( 'Cache-Control', 'no-cache, no-store, must-revalidate' );
        res.header( 'Pragma', 'no-cache' );
        res.header( 'Expires', 0 );
        //console.log( '# Disabling cache for request:', req.url, '#' );
    }

    next();
});

// https://www.npmjs.com/package/method-override
app.use(methodOverride());

// REST routes
configRoutes(app);

if(config.preferences){
    if(config.preferences.workers){
        // use max number of cpu's
        if(config.preferences.workers === 999) {
            workerCount =  numCPUs;
        }
        else {
            workerCount = Math.max(1, Math.min(config.preferences.workers, numCPUs));
        }
    }

    if(config.preferences.cluster == false){
        isClusterOn = false;
    }
}

if(cluster.isMaster && isClusterOn) {

    for (var i = 0; i < workerCount; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('\u001b[90m' + 'Worker #' + worker.id + ' is online.' + '\u001b[0m');
    });

    cluster.on('listening', function(worker, address) {
        console.log('\u001b[90m' + 'Worker #' + worker.id + ' is listening to port ' + address.port + '\u001b[0m');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('\u001b[33m' + 'Worker %d died (%s). restarting...', worker.process.pid, signal || code + '\u001b[0m');
        cluster.fork();
    });


} else {

    // Fire up server and configure socket.io
    var httpServer = http.createServer(app);

    httpServer.listen(app.get('port'), function() {
        console.log('\u001b[36m' + 'Express server listening on port: ' + app.get('port') + '\u001b[0m');
    });

};

module.exports = app;
