angular.module('linkslap.controllers')
.controller('StreamsCtrl', ['$scope', 'Restangular', '$localStorage', function ($scope, rest, storage) {
    $scope.subscriptions = storage.subscriptions;
}]);