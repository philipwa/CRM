/**
 * Created by philip on 02/02/16.
 */

// SERVICES
crmApp.service('SessionService', function() {

    var userIsAuthenticated = false;

    this.setUserAuthenticated = function(value){
        userIsAuthenticated = value;
    };

    this.getUserAuthenticated = function(){
        return userIsAuthenticated;
    };

});
