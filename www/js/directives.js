angular.module('linkslap.directives', [])
.config(function ($provide) {
    $provide.decorator('$ionicHistory', function ($delegate) {
        var registerFunction = $delegate.register;

        $delegate.register = function ($scope, viewLocals) {
            var rsp = registerFunction.apply(this, arguments);

            // If there is a navigable parent state then override Ionic and set
            // the back button to visable
            if (!rsp.enableBack && !viewLocals.$$state.parent.self.abstract) {
                rsp.enableBack = true;
            }

            return rsp;
        };
        return $delegate;
    });
})
.directive('stateNavBackButton', function ($ionicHistory, $ionicViewSwitcher, $state) {
    return {
        restrict: 'A',
        priority: 10,
        compile: function (tElement, tAttrs) {
            tAttrs.$set('ngClick', 'customStateBack()');

            return function (scope) {
                scope.customStateBack = function () {
                    if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    } else if (!!$state.$current.parent.navigable) {
                        $ionicHistory.nextViewOptions({
                            disableBack: true,
                            historyRoot: false
                        });
                        $ionicViewSwitcher.nextDirection('back');

                        $state.go('^');
                    }
                };
            };
        }
    };
})
.directive('ionTabs', function ($rootScope, $state, $ionicHistory, $ionicViewSwitcher) {
    function getTabRootState(state) {
        var isRootState;

        if (state.parent.self.abstract) {
            isRootState = state.self.name;
        } else {
            isRootState = false;
        }

        return isRootState || getTabRootState(state.parent);
    }

    function isTabRootState(state) {
        return state.self.name === getTabRootState(state);
    }

    return {
        restrict: 'E',
        require: 'ionTabs',
        link: function (scope, element, attr, ctrl) {
            var selectTab = ctrl.select;

            ctrl.select = function (tab, shouldEmitEvent) {
                var selectedTab = ctrl.selectedTab();

                if (arguments.length === 1) {
                    shouldEmitEvent = !!(tab.navViewName || tab.uiSref);
                }

                if (selectedTab && selectedTab.$historyId == tab.$historyId && !isTabRootState($state.$current)) {
                    if (shouldEmitEvent) {
                        $ionicHistory.nextViewOptions({
                            disableBack: true,
                            historyRoot: false
                        });
                        $ionicViewSwitcher.nextDirection('back');
                        $state.go(getTabRootState($state.$current));
                    }
                } else if (selectedTab && selectedTab.$historyId == tab.$historyId && isTabRootState($state.$current)) {
                    return;
                } else {
                    selectTab.apply(this, arguments);
                }
            };
        }
    };
});