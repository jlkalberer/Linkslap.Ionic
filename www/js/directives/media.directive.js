(angular.module('linkslap.directives'))
.directive("media", [
    '$sce', '$ionicPlatform', 'Restangular',
    function ($sce, $ionicPlatform, rest) {
        function isImage(url) {
            if (!url) {
                return false;
            }
            url = url.split('?')[0];

            return url.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) != null;
        }

        function isVideo(url) {
            if (!url) {
                return false;
            }
            url = url.split('?')[0];

            return url.toLowerCase().match(/\.(mp4|ogg|webm)$/) != null;
        }

        function isImgurGif(url) {
            return url && url.toLowerCase().indexOf('imgur.com') > -1;
        }

        return {
            transclude: true,
            scope: {
                'source': '@',
                'autoplay': '@',
                'hidePage': '@'
            },
            restrict: 'E',
            replace: true,
            templateUrl: "templates/media.html",
            link: function (scope) {
                $ionicPlatform.ready(function () {
                    scope.isWindows = window.device && device.platform == 'windows';
                });

                scope.playing = !(!scope.autoplay);

                scope.$watch('source', function () {
                    if (!scope.source) {
                        return;
                    }

                    scope.src = $sce.trustAsResourceUrl(scope.source);

                    scope.isImage = isImage(scope.src);
                    scope.isImgurGif = isImgurGif(scope.src);
                    scope.isVideo = isVideo(scope.src);


                    if (scope.isImgurGif) {
                        var src = scope.src.replace('.gif', '');
                        scope.mp4 = $sce.trustAsResourceUrl(src + '.mp4');
                        scope.webm = $sce.trustAsResourceUrl(src + '.webm');
                        scope.ogg = $sce.trustAsResourceUrl(src + '.ogg');
                    }

                    if (scope.isVideo) {
                        if (scope.src.indexOf('.mp4')) {
                            scope.mp4 = scope.src;
                        } else if (scope.src.indexOf('.webm')) {
                            scope.webm = scope.src;
                        } else if (scope.src.indexOf('.ogg')) {
                            scope.ogg = scope.src;
                        }
                    }

                    if (scope.isVideo || scope.isImage) {
                        scope.image = { 'background-image': 'url(' + scope.src + ')' };
                    }

                    // Use InAppBrowser if https
                    scope.isInAppBrowser = !scope.isWindows && !scope.isImage && scope.src.indexOf('https://') > -1;
                });

                scope.showInAppBrowser = function() {
                    window.open(scope.src, '_blank', 'location=yes');
                };
            }
        }
    }
]);