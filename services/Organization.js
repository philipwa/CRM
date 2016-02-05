/**
 * Created by philip on 03/02/16.
 */


'use strict';

var util = require('util'),
    squel = require('squel'),
    Q = require('q'),
    _ = require('underscore'),
    Base = require('./Base');


function Service( ) {
    Base.call(this);

}

util.inherits(Service, Base);

Service.prototype.get = function ( ) {

    var self = this;

    var sql = squel.select()
        .field('id')
        .field('name')
        .field('description')
        .from('public.organization')
        .toString();

    return self.query(sql)
        .then(function (results) {

            return results.rows;
        })
        .fail(function fail (err) {
            if(err) {
                throw err;
            }
        });
};

Service.prototype.delete = function ( id ){

    var self = this;

    var sql = squel.delete()
        .from('public.organization')
        .where('public.organization.id = ?', id)
        .toString();

    return self.query(sql);

};

Service.prototype.save = function ( data ) {

    var self = this;
    var found = false;

    return Q.fcall(function checkOrganization() {

        var sql = squel.select()
            .field('id')
            .from('public.organization')
            .where('public.organization.name = ?', data.name)
            .toString();

        return self.query(sql)
            .then(function (results) {
                if (results.rows.length > 0) {
                    found = true;
                    // exist
                }
                return;
            });
    })
    .then(function createOrganization() {

        var sql = '';
        if(found === true){

            sql = squel.update()
                .table('public.organization')
                .set('description', data.description)
                .toString();
        }
        else {
            sql = squel.insert()
                .into('public.organization')
                .set('name', data.name)
                .set('description', data.description)
                .toString();
        }
        return self.query(sql);
    })
    .then(function done(){
        return {created:true};
    })
    .fail(function fail (err) {
        if(err) {
            throw err;
        }
    });
}

module.exports = function() {
    return new Service( );
};
