/**
 * Created by philip on 01/02/16.
 */
var config = require('../config'),
    signature = require('express/node_modules/cookie-signature');

// http://stackoverflow.com/questions/11897965/what-are-signed-cookies-in-connect-expressjs

exports.middleware = function () {
    return function (req, res, next) {
        var token = req.query.token;

        if ( token && req.cookies ) {
            req.cookies['connect.sid'] = token;
        }

        next();
    };
};

exports.genToken = function (req) {
    return 's:' + signature.sign(req.sessionID, config.secretKey);
};
