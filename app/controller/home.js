;
angular.module('doog.library-www').controller('HomeController', ['$scope', '$location', '$log', 'BookService', function($scope, $location, $log, BookService) {
    $log.info('location.url: ' + $location.url());
    $log.info('location.path: ' + $location.path());
    $log.info('location.absUrl: ' + $location.absUrl());
    $scope.title = 'Home';
    $scope.expressBooks = [];
    $scope.popularBooks = [];

    BookService.express(function(bookList) {
        $scope.expressBooks = bookList;
        $log.info('express done.');
    });

    BookService.popular(function(bookList) {
        $scope.popularBooks = bookList;
        $log.info('popular done.');
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
