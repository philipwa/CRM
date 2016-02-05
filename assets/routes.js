/**
 * Created by philip on 02/02/16.
 */
crmApp.config(function ($routeProvider) {

    // https://coderwall.com/p/f6brkg/angularjs-access-control-and-authentication
    $routeProvider
        .when('/', {
            templateUrl: 'login.html',
            controller: 'loginController',
            requireLogin: false
        })
        .when('/mainPage', {
            templateUrl: 'mainPage.html',
            controller: 'mainController',
            requireLogin: true
        })
        .when('/organization', {
            templateUrl: 'organization.html',
            controller: 'organizationController',
            requireLogin: true
        })
        .when('/contact', {
            templateUrl: 'contact.html',
            controller: 'contactController',
            requireLogin: true
        })
        .otherwise({
            redirectTo:'/'
        });
     });


crmApp.run(['$rootScope', 'SessionService', '$location', '$route',
    function($rootScope,SessionService, $location, $route) {
        $rootScope.$on('$locationChangeStart', function(event) {

            var routes = $route.routes,
                currentPath = $location.path(),
                nextRoute = {requireLogin: false};

            angular.forEach(routes, function(route, key) {
                if (currentPath.match(route.regexp) && key !== 'null') {
                    nextRoute = route;
                }
            });

            // If the User is not loaded, load it to the UserService
            if(nextRoute && nextRoute.requireLogin && !SessionService.getUserAuthenticated()) {
                $location.path('/');
            }
        });
    }]);