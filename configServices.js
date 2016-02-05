/**
 * Created by philip on 01/02/16.
 */
var DB = require('./components/PGAdapter/DB'),
    loader = require('./components/Loader');

module.exports = function(app) {

    var loadService = loader();
    loadService.storage = __dirname + '/services/';

    var svc = {};

    //var config = app.get('config');
    //var db = {}, svc = {};
    //db.local = new DB(config.localdb);

    svc.Authorization = loadService('Authorization');
    svc.Organization = loadService('Organization');
    svc.Contact = loadService('Contact');

    // store in application
    app.set('services', svc);

};