;
angular.module('doog.library-www').controller('LoginController', ['$scope', '$log', function($scope, $log) {
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
