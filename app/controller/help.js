;
angular.module('doog.library-www').controller('HelpController', ['$scope', '$log', '$location', function($scope, $log, $location) {
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

    $scope.next = function () {
        $location.search({start: new Date().getTime(), size: 10});
    }
}]);
