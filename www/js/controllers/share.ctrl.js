angular.module('linkslap.controllers')
.controller('ShareCtrl', [
'$scope',
'Restangular',
'$stateParams',
'$localStorage',
'$ionicHistory',
'$state',
function ($scope, rest, $stateParams, storage, $ionicHistory, $state) {
    $scope.url = $stateParams.url;

    $scope.streams = _.pluck(storage.subscriptions, 'stream');

    $scope.share = function() {
        //var stream = $scope.streams[].key;
        rest.all('api/link').post({ streamKey: $scope.selectedStream, url: $scope.url })
            .then(function (response) {
                if (!response) {
                    return;
                }

                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });

                $state.go('tab.streams.stream.links', { streamKey: response.streamKey, linkId: response.id, page: 0 });
            });
    };

    $scope.canSubmit = function() {
        return !(!$scope.selectedStream);
    };
}]);