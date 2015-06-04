;
angular.module('doog.library-www').service('AuthService', ['$http', function($http) {
    this.userLoggedIn = function() {
        return true;
    }
}]);
