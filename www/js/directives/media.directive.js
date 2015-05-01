(angular.module('linkslap.directives'))
.directive("media", [
    '$sce', '$rootScope',
    function ($sce, $rootScope) {
        function isImage(url) {
            return url && url.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) != null;
        }

        function isVideo(url) {
            return url && url.toLowerCase().match(/\.(mp4|ogg|webm)$/) != null;
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
                scope.playing = !(!scope.autoplay);

                scope.$watch('source', function() {
                    if (!scope.source) {
                        return;
                    }

                    scope.src = $sce.trustAsResourceUrl(scope.source);

                    scope.isImage = isImage(scope.src);
                    scope.isImgurGif = isImgurGif(scope.src);
                    scope.isVideo = isVideo(scope.src);


                    if (scope.isImgurGif) {
                        scope.src = scope.src.replace('.gif', '');
                        scope.mp4 = $sce.trustAsResourceUrl(scope.src + '.mp4');
                        scope.webm = $sce.trustAsResourceUrl(scope.src + '.webm');
                        scope.ogg = $sce.trustAsResourceUrl(scope.src + '.ogg');
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
                        scope.image = { 'background-image': 'url(' + $sce.trustAsResourceUrl(scope.src + '.gif') + ')' };
                    }
                });
            }
        }
    }
]);