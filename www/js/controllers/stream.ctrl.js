angular.module('linkslap.controllers')
.controller('StreamCtrl', ['$scope', 'Restangular', '$stateParams', '$localStorage', '$timeout', function ($scope, rest, $stateParams, storage, $timeout) {
    $scope.key = $stateParams.streamKey;
    $scope.currentPage = 0;

    var subscription = _.find(storage.subscriptions, function (s) { return s.stream.key === $scope.key; });
    $scope.stream = subscription.stream;
    $scope.links = [];
    $scope.canLoadMore = true;

    $scope.load = function () {
        rest.one("api/stream", $scope.key.toLowerCase()).getList('links', { page: $scope.currentPage, limit: 20 }).then(function (response) {
            /*for (var i = 0; i < values.length; i += 1) {
            values[i].createdDate = moment(values[i].createdDate, settings.dateFormat).format("M/D/YYYY h:mm a")
        }*/

            _.each(response, function(link) {
                if (_.find(subscription.newLinks, function(id) { return id === link.id })) {
                    link.isNew = true;
                }
            });

            $scope.links = $scope.links.concat(response);
            $scope.canLoadMore = response.length > 0;

            $timeout(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 500);
        }, function() {
            $scope.noResults = true;
            $scope.canLoadMore = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });

        $scope.currentPage += 1;
    };
}]);