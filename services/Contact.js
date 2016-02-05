/**
 * Created by philip on 03/02/16.
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

Service.prototype.save = function ( data ){

    var self = this;
    var found = false;

    return Q.fcall(function checkContact() {

        var sql = squel.select()
            .field('id')
            .from('public.contact')
            .where('public.contact.login = ?', data.login)
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
    .then(function createContact() {

        var sql = '';
        if(found === true){
            sql = squel.update()
                .table('public.contact')
                .set('password', data.password)
                .set('first_name', data.first_name)
                .set('last_name', data.last_name)
                .set('organization_id', data.organization.id)
                .toString();
        }
        else {
            sql = squel.insert()
                .into('public.contact')
                .set('login', data.login)
                .set('password', data.password)
                .set('first_name', data.first_name)
                .set('last_name', data.last_name)
                .set('organization_id', data.organization.id)
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

};

Service.prototype.delete = function ( id ){

    var self = this;

    var sql = squel.delete()
        .from('public.contact')
        .where('public.contact.id = ?', id)
        .toString();

    return self.query(sql);

};

Service.prototype.get = function ( ){

    var self = this;

    var sql = squel.select()
        .field('public.contact.*')
        .field('public.organization.name','organization_name')
        .field('public.organization.description','organization_description')
        .from('public.contact')
        .join('public.organization',null,'public.organization.id = public.contact.organization_id')
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

module.exports = function() {
    return new Service( );
};

