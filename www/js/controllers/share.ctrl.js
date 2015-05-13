angular.module('linkslap.controllers')
.controller('ShareCtrl', [
'$scope',
'Restangular',
'$stateParams',
'$localStorage',
'$ionicHistory',
'$state',
function ($scope, rest, $stateParams, storage, $ionicHistory, $state) {
    $stateParams.url = "https://google.com";
    $scope.url = $stateParams.url;


    $scope.streams = _.pluck(storage.subscriptions, 'stream');

    $scope.share = function () {
        if ($scope.sending) {
            return;
        }

        $scope.sending = true;

        rest.all('api/link').post({ streamKey: $scope.selectedStream, url: $scope.url, comment: $scope.comment })
            .then(function (response) {
                if (!response) {
                    return;
                }

                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });

                $state.go('tab.streams.stream.links', { streamKey: response.streamKey, linkId: response.id, link: response });
            });
    };

    $scope.canSubmit = function() {
        return !(!$scope.selectedStream);
    };
}]);