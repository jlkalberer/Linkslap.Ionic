angular.module('linkslap.controllers')
.controller('SearchCtrl', [
'$scope', 'Restangular', '$timeout', '$ionicScrollDelegate', '$state', '$localStorage',
function ($scope, rest, $timeout, $ionicScrollDelegate, $state, storage) {
    $scope.search = '';
    $scope.pageCount = [];
    $scope.currentPage = 1;
    $scope.limit = 10;
    $scope.results = [];
    $scope.searching = false;
    $scope.totalCount = 0;
    $scope.noSearch = true;

    $scope.searchGif = function () {
        if ($scope.currentPage === 1) {
            $scope.results = [];
        }

        if (!$scope.search) {
            $scope.pageCount = [];
            return;
        }

        $scope.noSearch = false;

        if ($scope.searching) {
            return;
        }

        $scope.searching = true;

        rest.oneUrl('/api/gifs/search')
            .get({ query: $scope.search, page: ($scope.currentPage - 1), limit: $scope.limit, sfw: !$scope.nsfw })
            .then(function (result) {
                if ($scope.currentPage === 1) {
                    $scope.totalCount = result.total;
                    $scope.pageCount = Math.ceil(result.total / $scope.limit);
                    $scope.results = result.results;
                    $ionicScrollDelegate.scrollTop(false);
                } else {
                    $scope.results = $scope.results.concat(result.results);
                }

                $scope.noResults = result.total === 0;

                $timeout(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.searching = false;
                }, 500);
            }, function() {
                $scope.noResults = true;
            });


    };

    $scope.canLoadMore = function() {
        return !(!$scope.search) && $scope.totalCount !== $scope.results.length;
    };

    $scope.loadMore = function () {
        $scope.currentPage += 1;
        $scope.searchGif();
    };

    $scope.$watch('search', function () { $scope.currentPage = 1; $scope.searchGif(); });

    $scope.getNewLinkCount = function() {
        return _.reduce(storage.subscriptions, function(current, sub) { return current + sub.newLinks.length; }, 0);
    };
}]);