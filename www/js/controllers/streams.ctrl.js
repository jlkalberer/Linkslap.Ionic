angular.module('linkslap.controllers')
.controller('StreamsCtrl', ['$scope', 'Restangular', '$localStorage', function ($scope, rest, storage) {
    if (!storage.subscriptions) {
        rest.all('api/subscription').getList()
            .then(function(response) {
                $scope.subscriptions = storage.subscriptions = response;
            });
    } else {
        $scope.subscriptions = storage.subscriptions;
    }
}]);