/**
 * Created by philip on 02/02/16.
 */
crmApp.controller('loginController', ['$scope','$rootScope', '$resource', '$routeParams','$http','$location','$timeout','SessionService',
    function($scope,$rootScope, $resource, $routeParams,$http,$location,$timeout, SessionService) {

    $scope.username ='';
    $scope.password ='';

    $scope.Login = function(){

        SessionService.setUserAuthenticated(false);
        var input= { user: $scope.username, password:$scope.password};

        $http.post('/login', input)
            .success(function (results) {
            if(results.login === true){
                    $location.path('/mainPage');
                    SessionService.setUserAuthenticated( results.login );
                }
                else{
                    $scope.$emit("errorMessage", "Unauthorized");
                }
            })
            .error(function (err) {
                $scope.$emit("errorMessage", "Unauthorized");
            });
    };

    $scope.Logout = function(){

    };

    $scope.$on("errorMessage", function(e, message) {
        $scope.errorMessage = message;
        $timeout( function() {
            delete($scope.errorMessage);
        }, 3000);
    });
}]);

crmApp.controller('mainController', ['$scope', '$resource', '$routeParams','$http', function($scope, $resource, $routeParams,$http) {

}]);

crmApp.controller('organizationController', ['$scope', '$resource', '$routeParams','$http','$timeout', function($scope, $resource, $routeParams,$http,$timeout) {

    $scope.canDelete = true;
    $scope.organizations = [];
    $scope.organizationSelected = null;

    $scope.organization = {name:'',description:''};

    $scope.clear = function(){
        $scope.organization.name = '';
        $scope.organization.description = '';
        $scope.organizationSelected = null;

        $scope.canDelete = true;
    };

    $scope.organizationSave = function(){

        var input= { name: $scope.organization.name, description:$scope.organization.description};

        $http.post('/saveOrganization', input)
            .success(function (results) {
                $scope.clear();
                $scope.$emit("errorMessage", "Save success");
            })
            .error(function (err) {
                $scope.$emit("errorMessage", "Unable to save");
            });

    };

    $scope.getOrganization = function( organization ) {

        $scope.organization.name = organization.name;
        $scope.organization.description = organization.description;
        $scope.canDelete = false;
    };

    $scope.deleteOrganization = function(){

        $http.delete('/deleteContact/' + $scope.organizationSelected.id.toString())
            .success(function (results) {
                $scope.clear();
                $scope.$emit("errorMessage", "Delete success");
            })
            .error(function (err) {
                $scope.$emit("errorMessage", "Unable to delete");
            });
    };

    $scope.getOrganizations = function(){
        $http.get('/getOrganizations')
            .success(function (results) {
                for(var i = 0;i< results.length ;i++){
                    $scope.organizations.push(results[i]);
                }
            })
            .error(function (err) {

            });
    };

    $scope.getOrganizations();

    $scope.$on("errorMessage", function(e, message) {
        $scope.errorMessage = message;
        $timeout( function() {
            delete($scope.errorMessage);
        }, 3000);
    });

}]);

crmApp.controller('contactController', ['$scope', '$resource', '$routeParams','$http','$timeout', function($scope, $resource, $routeParams,$http,$timeout) {

    $scope.contact = {login:'',password:'',first_name:'',last_name:'', organization: null };
    $scope.contacts = [];
    $scope.contactSelected = null;
    $scope.organization = [];
    $scope.canDelete = true;


    $scope.getContact = function( contact){
        $scope.contact.login = contact.login;
        $scope.contact.password = contact.password;
        $scope.contact.first_name = contact.first_name;
        $scope.contact.last_name = contact.last_name;
        $scope.contact.organization = {id :contact.organization_id ,name:contact.organization_name , description:contact.organization_description };
    };

    $scope.getContacts = function(){

        $http.get('/getContacts')
            .success(function (results) {
                for(var i = 0;i< results.length ;i++){
                    $scope.contacts.push( results[i] );
                }
                $scope.canDelete = false;
              })
            .error(function (err) {
                $scope.$emit("errorMessage", "Unable to get contact");
            });
    };

    $scope.getOrganizations = function(){
        $http.get('/getOrganizations')
            .success(function (results) {
                for(var i = 0;i< results.length ;i++){
                    $scope.organization.push(results[i]);
                }
            })
            .error(function (err) {
                $scope.$emit("errorMessage", "Unable to get organizations");
            });
    };
    $scope.getOrganizations();
    $scope.getContacts();

    $scope.deleteContact = function(){

        $http.delete('/deleteContact/' + $scope.contactSelected.id.toString())
            .success(function (results) {
                $scope.clear();
                $scope.$emit("errorMessage", "delete success");
            })
            .error(function (err) {
                $scope.$emit("errorMessage", "Unable to delete");
            });
    };

    $scope.clear = function(){
        $scope.canDelete = false;
        $scope.contact.login = '';
        $scope.contact.password = '';
        $scope.contact.first_name = '';
        $scope.contact.last_name = '';
        $scope.contact.organization = null;
    };

    $scope.saveContact = function(){

        var input= $scope.contact;

        $http.post('/saveContact', input)
            .success(function (results) {

                $scope.clear();
                $scope.$emit("errorMessage", "save success");
            })
            .error(function (err) {
                $scope.$emit("errorMessage", "unable to save");
            });
    }

    $scope.$on("errorMessage", function(e, message) {
        $scope.errorMessage = message;
        $timeout( function() {
            delete($scope.errorMessage);
        }, 3000);
    });

}]);