angular.module('doog.library-www').directive('myAccess', ['authService', 'removeElement', function(authService, removeElement) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            var hasAccess = false;
            var allowedAccess = attributes.myAccess.split(" ");
            for (i = 0; i < allowedAccess.length; i++) {
                if (authService.userHasRole(allowedAccess[i])) {
                    hasAccess = true;
                    break;
                }
            }

            if (!hasAccess) {
                angular.forEach(element.children(), function(child) {
                    removeElement(child);
                });
                removeElement(element);
            }

        }
    }
}]).constant('removeElement', function(element) {
    element && element.remove && element.remove();
});
