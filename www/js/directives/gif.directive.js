(angular.module('linkslap.directives'))
.directive("gif", [
    '$sce', '$rootScope',
    function ($sce, $rootScope) {
        return {
            transclude: true,
            scope: {
                'source': '@',
                'thumb': '@',
                'autoplay': '@'
            },
            restrict: 'E',
            replace: true,
            template:   "<div>" +
                            "<a href='#' ng-click='$event.preventDefault(); thumbClicked();' ng-show='!playing'>" +
                                "<img class='img-responsive' ng-src='{{thumb}}' />" +
                            "</a>" +
                            "<a class='video__overlay' href='#' ng-click='$event.preventDefault(); videoClicked();' ng-show='playing'>" +
                            "</a>" +
                            "<video autoplay='autoplay' preload='auto' loop='loop' ng-if='!loadError && playing'>" +
                                 "<source ng-src='{{mp4}}' type='video/mp4' />" +
                                "<source ng-src='{{webm}}' type='video/webm' />" +
                            "</video>" +
                            "<div class='gif-image' ng-style='gif' ng-if='loadError && playing'></div>" +
                            "<div ng-transclude></div>" +
                        "</div>",
            link: function (scope, element) {
                scope.playing = !(!scope.autoplay);
                scope.source = scope.source.replace('.gif', '');
                scope.mp4 = $sce.trustAsResourceUrl(scope.source + '.mp4');
                scope.webm = $sce.trustAsResourceUrl(scope.source + '.webm');
                scope.gif = { 'background-image': 'url(' + $sce.trustAsResourceUrl(scope.source + '.gif') + ')' };

                scope.source = $sce.trustAsResourceUrl(scope.source);

                function gifError(e) {
                    scope.loadError = true;
                }
                var player = null;
                scope.$watch('playing', function(val) {
                    if (player) {
                        player.off('error', gifError);
                    }

                    player = angular.element(element.find('source')[1]);
                    player.on('error', gifError);
                });

                scope.thumbClicked = function () {
                    $rootScope.$emit('gif.stop');
                    scope.playing = true;

                    if (scope.start) {
                        scope.start();
                    }
                };
                scope.videoClicked = function () {
                    scope.playing = false;

                    if (scope.stop) {
                        scope.stop();
                    }
                };

                $rootScope.$on('gif.stop', function() {
                    scope.playing = false;
                });
            }
        }
    }
]);