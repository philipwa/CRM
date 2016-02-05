/**
 * Created by philip on 01/02/16.
 */
/**
 * Postgres Transaction object
*/

var Q = require('q'),
    pg = require('pg'),
    Query = require('./PostgresQuery');


function Transaction (configs) {

    // label this instance
    var instanceName = (new Date()).getTime();


    var client = null;


    function deferQuery (queryConfig) {

        var deferred = Q.defer();
        var query = client.query(queryConfig);

        query.on('error', function(err) {
            console.log('----------------------------------------');
            console.log('transaction query.error', err.toString());
            console.log('transaction query.error sql', queryConfig.text);
            console.log('transaction query.error params', JSON.stringify(queryConfig.values));
            console.log('----------------------------------------');
            err.sqlErrorText = queryConfig.text;
            err.sqlErrorParams = JSON.stringify(queryConfig.values);
            deferred.reject(err);
        });

        query.on('row', function(row, result) {
            result.addRow(row);
        });

        query.on('end', function(result) {
            deferred.resolve(result);
        });

        return deferred.promise;
    }


    function initClient() {
        // console.log('initClient');
        client = new pg.Client(configs);
        client.connect();
    }

    function closeClient() {
        // console.log("closeClient");
        client.end();
    }


    return {

        begin: function() {
            // console.log('begin transation');
            initClient();
            return this.query('begin');
        },

        // defer a query
        query: function(sql, params, name) {

            // Need to transform transaction parameters
            // just like we transform the normal query params

            var promise = null;

            try {

                var parsedConfig = Query.parseQueryParameters({
                    text: sql,
                    values: params || null,
                    name: name || null
                });

                promise = deferQuery(parsedConfig);

            } catch (err) {

                var def = Q.defer();
                def.reject(new Error(err));
                promise = def.promise;

            }

            return promise;

        },

        queryRow: function (sql, params) {
            return this.query(sql, params).then(function(data) {
                if (data && !_.isEmpty(data.rows)) {
                    return data.rows[0];
                }
            });
        },

        commit: function() {
            // console.log('commit');
            return this.query('commit')
                .then(closeClient);
        },

        rollback: function() {
            console.log('rollback');
            return this.query('rollback')
                .then(closeClient);
        },

        instanceName: function() {
            return instanceName;
        }

    };

}

module.exports = Transaction;

