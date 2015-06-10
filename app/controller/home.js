;
angular.module('doog.library-www').controller('HomeController', ['$scope', '$location', '$log', 'BookService', 'UserService', function($scope, $location, $log, BookService, UserService) {
    $scope.title = 'Home';
    $scope.expressBooks = [];
    $scope.popularBooks = [];

    UserService.get({id: '7788'}, function (user) {
        $scope.user = user;
    });

    BookService.express(function(bookList) {
        $scope.expressBooks = bookList;
    });

    BookService.popular(function(bookList) {
        $scope.popularBooks = bookList;
    });


    $scope.load = function() {
        BookService.express(function(bookList) {
            $log.info(bookList.length);
        });
    }

    // route event
    $scope.$on('$routeChangeStart', function(evt, next, current) {
        console.log('$scope $routeChangeStart');
    });

    $scope.say = function() {
        $scope.$emit('doog.say', 'haha~');
    }

    $scope.$on('doog.say', function() {
        $log.info('我听到 haha了。home.$scope');
    });

    $scope.$on('doge.say', function(evt, data) {
        $log.info(evt.name + ' ' + data);
    });

    $scope.$on('root:say', function(evt, data) {
        $log.info(evt.name + ' ' + data);
    });
}]);
