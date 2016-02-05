/**
 * Created by philip on 02/02/16.
 */
/**
 * Simple base class for data services. Exposes query
 * and transaction methods to subclasses. Brian C tells
 * me some other guy wrote excellent wrappers for basic
 * queries and transactions, we can easily swap mine out
 * for his.
 *
 * The idea is that services always return promises so that
 * we can string service calls together and the controller can
 * append the final action.
 *
 * The transaction method actually returns a transaction object
 * that itself creates promises. So it returns an object you
 * use to generte promises instead of a promise directly. That's
 * something I'd like to think of a solution for.
 */
'use strict';

var DB = require('./../components/PGAdapter/DB'),
    Q = require('q'),
    config = require('./../config');


function BaseService( ) {
 this._localDb = null;
}

// BaseService._localDb = null;
// BaseService._authDb = null;
// BaseService._elastic = null;
// BaseService._elasticMaster = null;

BaseService.prototype = {

    // tableName: null,
    transaction: null,

    /**
     * Getter for Postgres DB query wrapper. By default
     * it returns client for "cm" db, but you can override it
     * in your specific service. See Authentication service
     * for reference.
     *
     * @returns {DB}
     */
    get db() {
        return this.getLocalDb();
    },


    /**
     * Get Postgres DB query wrapper for "cm" db
     *
     * @returns {DB}
     */
    getLocalDb: function() {
        if (!BaseService._localDb) {
            BaseService._localDb = new DB(config.localdb);
        }
        return BaseService._localDb;
    },

    /**
     * Returns transaction object that can accept multiple
     * queries, exposes rollback and commit methods.
     */
    startTransaction: function(user_id, storeTransaction) {

        var self = this;
        var tx = this.db.startTransaction();

        return tx.begin()
            .then(function() {
                if (user_id) {
                    return self.startAudit(user_id, tx);
                } else {
                    return Q.resolve(true);
                }
            })
            .then(function() {
                if (storeTransaction) {
                    self.transaction = tx;
                }

                return tx;
            });
    },

    endTransaction: function() {
        this.transaction = null;
        return null;
    },

    setTransaction: function(tx) {
        this.transaction = tx;
    },

    getTransaction: function() {
        return this.transaction;
    },

    /**
     * Utility function either calls the a new query clent, or uses the
     * query method from the transaction object carrier.
     * @param tx
     * @returns {*}
     */

    /*
    getSource: function(tx) {
        return (tx === undefined) ? this.query.bind(this) : tx.query.bind(tx);
    },
    */

    /**
     * This method hydrates db objects from selectSource
     */
        /*
    hydrate: function() {
        throw new Error('Override and implement the method to use it');
    },
    */

    /**
     * Generic query, passes arguments down to pg.client.query eventually
     *
     * @return {promise}
     */
    query: function() {
        var tx = this.getTransaction();

        if (tx) {

            return tx.query.apply(this.db, arguments);
        } else {

            return this.db.query.apply(this.db, arguments);
        }
    }

    /*
    queryRow: function() {
        return this.db.queryRow.apply(this.db, arguments);
    },
    */


    /**
     * Generic database row hydrator functions
     */
        /*
    hydrateRows: function(cxtr, debug) {

        if (!cxtr.hydrate) {
            throw new Error('Indicated constructor has no hydrate method');
        }
        return function(result) {
            if (debug) {
                console.log('hydrateRows result', result);
            }
            return result.rows.map(cxtr.hydrate);
        };

    },
*/
    /*
    hydrateRow: function(cxtr) {

        if (!cxtr.hydrate) {
            throw new Error('Indicated constructor has no hydrate method');
        }

        return function(result) {
            return (result.rows.length) ?
                cxtr.hydrate(result.rows[0]) :
                null;
        };

    },
        */

    /*
    hydrateTree: function(cxtr) {

        // validate

        if (!cxtr.hydrate) {
            throw new Error('Indicated constructor has no hydrate method');
        }

        if (!cxtr.isTree) {
            throw new Error('Supplied object is not a tree');
        }
        return function(result) {

            var map = {};

            // We've got an array here in case of multiple root
            var rootNodes = [];

            result.rows.forEach(function(row) {
                var node = cxtr.hydrate(row);
                map[node.id()] = node;
                if (node.parent_id() === null || !map[node.parent_id()]) {
                    rootNodes.push(node);
                } else {
                    map[node.parent_id()].children().push(node);
                }
            });

            return rootNodes.length === 1 ? rootNodes[0] : rootNodes;

        };
    }
    */
};

/**
 * Postgres defaults in case we want
 * to use squel
 */
/*
BaseService.squelParams = {
    tableAliasQuoteCharacter: '',
    fieldAliasQuoteCharacter: ''
};
*/


module.exports = BaseService;
