/**
 * Created by philip on 01/02/16.
 */
'use strict';

var Q = require('q'),
    pg = require('pg'),
    _ = require('underscore');

function PostgresQuery(configs) {
    this.configs = configs;
}
PostgresQuery.prototype = {

    /**
     * This is a Q wrapper for pg.connect + pg.client.query
     *
     * @link https://github.com/brianc/node-postgres/wiki/pg#example
     * @returns {Q}
     */
    create: function() {
        var that = this, query,
            args = Array.prototype.slice.call(arguments),
            deferred = Q.defer();
        pg.connect(this.configs, function(err, client, done) {
            if(null !== err) {
                deferred.reject(err);
            } else {
                args.push(function(err, result) {
                    if(null !== err) {
                        that.onError(err, query);
                        deferred.reject(err);
                    } else {
                        deferred.resolve(result);
                    }
                    done();
                });
                query = client.query.apply(client, args);
            }
        });
        return deferred.promise;
    },

    /**
     * Log query error with text and values.
     *
     * @param err
     * @param query
     */
    onError: function(err, query) {
        console.log('----------------------------------------');
        console.log('query.error', err.toString());
        console.log('query', query.text);
        console.log('query.values', query.values);
        console.log('----------------------------------------');
    }
};

// node-postgres supports a lot of different parameter types.
// I'm going with the most flexible one, the config object
// mechanism, so I have the least number

PostgresQuery.parseQueryParameters = function(queryConfig) {

    // queryConfig will be an object like this corresponding
    // to the objec tparameter in the node-postgres docs
    // { text: sql, values: params }

    // Roman wanted to return the values the original way if
    // an array came in for the values.

    if (Array.isArray(queryConfig.values)) {
        return queryConfig;
    }
    // Otherwise do the new transformation
    return PostgresQuery.parsePlaceholders(queryConfig);

};

PostgresQuery.paramRE = /:+\w+/g;
PostgresQuery.whitespaceRE = /[ \s\t\r\n]+/g;

PostgresQuery.parsePlaceholders = function(queryConfig) {

    // There can be more parameters in the queryConfig
    // than just the sql and the input parameters so
    // preserve any other values

    function mergeVals(newSql, newVals) {

        var newConfig = _.extend({}, queryConfig, {
            text: newSql,
            values: newVals
        });

        return newConfig;
    }
    // Pull variables off Brian's terribly-named syntax
    var sql = queryConfig.text;
    var params = queryConfig.values;


    // Result variables
    var parsedSql = sql.trim().replace(PostgresQuery.whitespaceRE, ' ');
    var paramsArray = [];

    // Make sure we have some placeholders. If not, just
    // send the result back with an empty values array

    var matches = sql.match(PostgresQuery.paramRE);
    if (!matches) {
        return mergeVals(sql, []);
    }

    // Make a map of the named placeholders to numbered versions
    var paramName, paramValue, map = {};

    matches.forEach(function(match) {

        // Postgres does typecasting with two ::
        // check to see if we got ::, if so, do not replace
        if (match.substr(0, 2) === '::') {
            map[match] = match;
            return;
        }

        // Disallow params that start with a number
        // Originally to allow for 8:00am or some string like that
        if (match.substr(1, 1).match(/\d/)) {
            map[match] = match;
            return;
        }

        // chop off the :
        paramName = match.substr(1);

        // see if it exists in the provided values
        paramValue = params[paramName];
        if (paramValue === undefined) {
            throw new Error('There is no parameter "' + match + '" in arguments hash: ' + JSON.stringify(params) + ', for sql:' + queryConfig.text);
        }

        // check to see if we've already this match to a $x
        if (undefined === map[match]) {
            paramsArray.push(paramValue);
            map[match] = '$' + paramsArray.length;
        }
    });

    // Replace all the placeholders in one step

    parsedSql = parsedSql.replace(PostgresQuery.paramRE, function(match) {
        if (undefined === map[match]) {
            return match;
        }
        return map[match];
    });

    // Return args object with the text / values keys replaced by the
    // new parsed values in the horrible format Brian's library mandates

    return mergeVals(parsedSql, paramsArray);

};

module.exports = PostgresQuery;

