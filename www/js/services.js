angular.module('linkslap.services', []);

ionic.Platform.isIE = function () {
    return ionic.Platform.ua.toLowerCase().indexOf('trident') > -1;
}

if (ionic.Platform.isIE()) {
    angular.module('ionic')
      .factory('$ionicNgClick', ['$parse', '$timeout', function ($parse, $timeout) {
          return function (scope, element, clickExpr) {
              var clickHandler = angular.isFunction(clickExpr) ? clickExpr : $parse(clickExpr);

              element.on('click', function (event) {
                  scope.$apply(function () {
                      if (scope.clicktimer) return; // Second call
                      clickHandler(scope, { $event: (event) });
                      scope.clicktimer = $timeout(function () { delete scope.clicktimer; }, 1, false);
                  });
              });

              // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
              // something else nearby.
              element.onclick = function (event) { };
          };
      }]);
}