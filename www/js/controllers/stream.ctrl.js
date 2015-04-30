angular.module('linkslap.controllers')
.controller('StreamCtrl', ['$scope', 'Restangular', '$stateParams', '$localStorage', '$timeout', function ($scope, rest, $stateParams, storage, $timeout) {
    $scope.key = $stateParams.streamKey;
    $scope.currentPage = 0;

    $scope.stream = _.find(storage.subscriptions, function (s) { return s.stream.key === $scope.key; }).stream;
    $scope.links = [];
    $scope.canLoadMore = true;

    $scope.load = function () {
        rest.one("api/stream", $scope.key).getList('links', { page: $scope.currentPage, limit: 20 }).then(function (response) {
            /*for (var i = 0; i < values.length; i += 1) {
            values[i].createdDate = moment(values[i].createdDate, settings.dateFormat).format("M/D/YYYY h:mm a")
        }*/

            $scope.links = $scope.links.concat(response);
            $scope.canLoadMore = response.length > 0;

            $timeout(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 500);
        });

        $scope.currentPage += 1;
    };
}]);