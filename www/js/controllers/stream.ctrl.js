angular.module('linkslap.controllers')
.controller('StreamCtrl', ['$scope', 'Restangular', '$stateParams', '$localStorage', '$timeout', function ($scope, rest, $stateParams, storage, $timeout) {
    $scope.key = $stateParams.streamKey;
    $scope.currentPage = 0;

    var subscription = _.find(storage.subscriptions, function (s) { return s.stream.key === $scope.key; });
    $scope.stream = subscription.stream;
    $scope.links = [];
    $scope.canLoadMore = true;

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    $scope.formatDate = function(date) {
        return moment(moment.utc(date, "YYYY-MM-DDTHH:mm:ss.SSSZ").toDate()).format("M/D/YYYY h:mm a");
    }

    $scope.load = function () {
        rest.one("api/stream", $scope.key.toLowerCase()).getList('links', { page: $scope.currentPage, limit: 20, v: makeid() }).then(function (response) {
            /*for (var i = 0; i < values.length; i += 1) {
            values[i].createdDate = moment(values[i].createdDate, settings.dateFormat).format("M/D/YYYY h:mm a")
        }*/

            _.each(response, function (link) {
                if (_.find(subscription.newLinks, function (id) { return id === link.id })) {
                    link.isNew = true;
                }
            });

            $scope.links = $scope.links.concat(response);
            $scope.canLoadMore = response.length > 0;

            $timeout(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 500);
        }, function () {
            $scope.noResults = true;
            $scope.canLoadMore = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });

        $scope.currentPage += 1;
    };
}]);