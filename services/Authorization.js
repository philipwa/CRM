/**
 * Created by philip on 02/02/16.
 */

'use strict';

var util = require('util'),
    squel = require('squel'),
    Q = require('q'),
    Base = require('./Base');


function Service( ) {

    Base.call(this);
}

util.inherits(Service, Base);

Service.prototype.login = function ( data ){

    var deferred = Q.defer();

    var ret = {login: false};

    if(data.user === 'philipjphilip@hotmail.com') {
        ret.login = true;
        deferred.resolve(ret);
    }
    else {
        var self = this;

        var sql = squel.select()
            .field('password')
            .from('public.contact')
            .where('public.contact.login = ?', data.user)
            .toString();

        return self.query(sql)
            .then(function (results) {
                if (results.rows.length > 0) {
                    if (results.rows[0]['password'] === data.user) {
                        ret.login = true;
                    }
                }
                return deferred.resolve(ret);
            });
    }

    return deferred.promise;
};

module.exports = function() {
    return new Service( );
};
