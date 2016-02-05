/**
 * Created by philip on 01/02/16.
 */

'use strict';

var loader = require('./components/Loader');

var controller = loader();
controller.storage = __dirname + '/routes/';

module.exports = function(app) {

    var authorization = controller('Authorization',app);
    var organization = controller('Organization',app);
    var contact = controller('Contact',app);

    app.post('/login', authorization.login);
    app.post('/saveOrganization', organization.save);
    app.get('/getOrganizations', organization.get);

    app.post('/saveContact', contact.save);
    app.get('/getContacts', contact.get);

    app.delete('/deleteContact/:id', contact.delete);

    app.delete('/deleteOrganization/:id', organization.delete);
};