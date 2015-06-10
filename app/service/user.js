;
angular.module('doog.library-www').factory('UserService', ['$resource', function($resource) {
    return $resource('http://localhost:3000/users/:id', {
        id: "@Id"
    });
}]);
