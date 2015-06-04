;
angular.module('doog.library-www').controller('NotFoundController', ['$scope', '$log', function($scope, $log) {
    $scope.title = 'NotFound';

    $scope.$on('doog.say', function() {
        $log.info('我听到 haha了。not_found.$scope');
    });

    $scope.$on('doge.say', function(evt, data) {
        $log.info(evt.name + ' ' + data);
    });

    $scope.$on('root:say', function(evt, data) {
        $log.info(evt.name + ' ' + data);
    });
}]);
