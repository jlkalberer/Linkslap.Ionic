angular.module('linkslap.controllers')
.controller('SearchCtrl', [
'$scope', 'Restangular', '$q', '$timeout', '$ionicScrollDelegate', '$state', '$localStorage', '$ionicLoading',
function ($scope, rest, $q, $timeout, $ionicScrollDelegate, $state, storage, $ionicLoading) {
    $scope.search = '';
    $scope.pageCount = [];
    $scope.currentPage = 1;
    $scope.limit = 10;
    $scope.results = [];
    $scope.searching = false;
    $scope.totalCount = 0;
    $scope.noSearch = true;

    var abort;
    $scope.searchGif = function () {
        if ($scope.currentPage === 1) {
            $ionicScrollDelegate.scrollTop(false);
            $scope.searching = false;
            $scope.results = [];
            if (abort) {
                abort.resolve();
            }

            abort = $q.defer();
            $ionicLoading.show({
                template: 'Searching...'
            });
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
            .withHttpConfig({ timeout: abort.promise })
            .get({ query: $scope.search, page: ($scope.currentPage - 1), limit: $scope.limit, sfw: !$scope.nsfw })
            .then(function (result) {
                if ($scope.currentPage === 1) {
                    $scope.totalCount = result.total;
                    $scope.pageCount = Math.ceil(result.total / $scope.limit);
                    $scope.results = result.results;
                } else {
                    $scope.results = $scope.results.concat(result.results);
                }

                $scope.noResults = result.total === 0;

                $timeout(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.searching = false;
                }, 500);
                $ionicLoading.hide();

            }, function() {
                $scope.noResults = true;
                $scope.searching = false;
                $ionicLoading.hide();
            });


    };

    $scope.canLoadMore = function() {
        return !(!$scope.search) && $scope.totalCount !== $scope.results.length;
    };

    $scope.loadMore = function () {
        $scope.currentPage += 1;
        $scope.searchGif();
    };

    //$scope.$watch('search', function () { $scope.currentPage = 1; $scope.searchGif(); });

    $scope.getNewLinkCount = function() {
        return _.reduce(storage.subscriptions, function(current, sub) { return current + sub.newLinks.length; }, 0);
    };
}]);