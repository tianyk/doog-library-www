;
angular.module('doog.library-www').controller('HelpController', ['$scope', '$log', '$location', 'BookService', function($scope, $log, $location, BookService) {
    $scope.title = 'Help';

    $scope.$on('doog.say', function() {
        $log.info('我听到 haha了。help.$scope');
    })

    $scope.$on('doge.say', function(evt, data) {
        $log.info(evt.name + ' ' + data);
    });

    $scope.$on('root:say', function(evt, data) {
        $log.info(evt.name + ' ' + data);
    });

    $scope.next = function() {
        $location.search({
            start: new Date().getTime(),
            size: 10
        });
    }

    $scope.load = function() {
        BookService.express(function(bookList) {
            $log.info(bookList.length);
        });
    }
}]);
