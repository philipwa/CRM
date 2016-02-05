/**
 * Created by philip on 01/02/16.
 */
/*
 * Dumb wrapper for node-postgres. Basically the only reason
 * this exists is so that I can inject it into services.
*/
'use strict';

var Q = require('q'),
    Query = require('./PostgresQuery'),
    Transaction = require('./PostgresTransaction'),
    _ = require('underscore');


function DB(configs) {
    this.configs = configs;
}

/**
 * @param sql
 * @param params
 * @returns {promise}
 */
DB.prototype.query = function(sql, params) {

    var promise = null;

    try {

        var qry = new Query(this.configs);

        var parsedConfig = Query.parseQueryParameters({
            text: sql,
            values: params
        });

        promise = qry.create(parsedConfig);

    } catch (err) {

        var def = Q.defer();
        def.reject(new Error(err));
        promise = def.promise;

    }

    return promise;

};

DB.prototype.queryRow = function(sql, params) {
    return this.query(sql, params)
        .then(function(data) {
            if (data && !_.isEmpty(data.rows)) {
                return data.rows[0];
            }
        });
};

DB.prototype.startTransaction = function() {
    return new Transaction(this.configs);
};

module.exports = DB;
