angular.module('linkslap.directives')
.factory('scrollPositions', function () {
    return [];
})
.directive('keepScroll', function ($filter, $state, $ionicScrollDelegate, scrollPositions) {
    return function ($scope) {
        var view = $filter('filter')(scrollPositions, { name: $state.current.name })[0];
        var position = $ionicScrollDelegate.getScrollPosition(); //

        if (!view) {
            view = {
                name: $state.current.name,
                position: position
            };
            scrollPositions.push(view);
        }

        // Save scroll position on view change
        $scope.$on("$stateChangeStart", function () {
            if (view.name !== $state.current.name) {
                return;
            }

            view.position = $ionicScrollDelegate.getScrollPosition();
        });

        $scope.$on("$stateChangeSuccess", function (args, newState) {
            if (view.name !== newState.name) {
                return;
            }

            $ionicScrollDelegate.scrollTo(0, view.position.top, false);
        });
    }
});