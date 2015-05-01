angular.module('linkslap.controllers')
.controller('LinksCtrl', ['$scope', 'Restangular', '$stateParams', '$localStorage', '$timeout', function ($scope, rest, $stateParams, storage, $timeout) {
    var key = $stateParams.streamKey,
        linkId = $stateParams.linkId,
        currentPage = $stateParams.page - 1;

    $scope.links = [{}];
    $scope.slideIndex = 0;

    $scope.load = function () {
        return rest.one("api/stream", key).getList('links', { page: currentPage, limit: 20 }).then(function (response) {
            $timeout(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 500);

            return response;
        });
    };

    $scope.slideChanged = function(index) {
    };

    rest.one("api/link", linkId).get().then(function(link) {
        $scope.link = link;

        $scope.isImage = link.url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    });

    //$scope.load().then(function (response) {
    //    $scope.links = response;
    //    $scope.slideChanged(0);
    //});

    $scope.loadPrevious = function () {
        currentPage -= 1;

        $scope.load().then(function (response) {
            $scope.links = response.concat($scope.links);
            $scope.canLoadPrevious = response.length > 0;
        });
    };

    $scope.loadNext = function () {
        currentPage += 1;

        $scope.load().then(function (response) {
            $scope.links = $scope.links.concat(response);
            $scope.canLoadNext = response.length > 0;
        });
    };
}]);