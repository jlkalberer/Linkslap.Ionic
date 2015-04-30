angular.module('linkslap.controllers')
.controller('SearchCtrl', ['$scope', 'Restangular', '$timeout', function ($scope, rest, $timeout) {
    $scope.search = '';
    $scope.pageCount = [];
    $scope.currentPage = 1;
    $scope.limit = 10;
    $scope.results = [];
    $scope.searching = false;
    $scope.totalCount = 0;

    $scope.searchGif = function () {
        if ($scope.currentPage === 1) {
            $scope.results = [];
            $scope.$broadcast('scroll.scrollTop');
        }

        $scope.searching = true;

        if (!$scope.search) {
            $scope.pageCount = [];
            return;
        }

        rest.oneUrl('/api/gifs/search')
            .get({ query: $scope.search, page: ($scope.currentPage - 1), limit: $scope.limit, sfw: !$scope.nsfw })
            .then(function (result) {
                if ($scope.currentPage === 1) {
                    $scope.totalCount = result.total;
                    $scope.pageCount = Math.ceil(result.total / $scope.limit);
                    $scope.results = result.results;
                } else {
                    $scope.results = $scope.results.concat(result.results);
                }

                $scope.searching = false;

                $timeout(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, 500);
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
}]);