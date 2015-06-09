;
angular.module('doog.library-www').controller('LoginController', ['$scope', '$location', '$log', function($scope, $location, $log) {
    $log.info('location.url: ' + $location.url());
    $log.info('location.path: ' + $location.path());
    $log.info('location.absUrl: ' + $location.absUrl());
    $scope.title = 'Login';

    $scope.$on('doog.say', function() {
        $log.info('我听到 haha了。login.$scope');
    });

    $scope.$on('doge.say', function(evt, data) {
        $log.info(evt.name + ' ' + data);
    });

    $scope.$on('root:say', function(evt, data) {
        $log.info(evt.name + ' ' + data);
    });
}]);
