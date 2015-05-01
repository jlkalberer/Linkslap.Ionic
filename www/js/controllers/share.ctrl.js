angular.module('linkslap.controllers')
.controller('ShareCtrl', ['$scope', 'Restangular', '$stateParams', function ($scope, rest, $stateParams) {
    $scope.thumb = $stateParams.thumb;
    $scope.url = $stateParams.url;
}]);