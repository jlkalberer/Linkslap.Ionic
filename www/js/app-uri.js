angular.module('linkslap')
.run([
'$rootScope', '$ionicPlatform', 'Restangular', '$ionicPopup', '$localStorage', '$ionicHistory', '$state',
function ($rootScope, $ionicPlatform, rest, $ionicPopup, storage, $ionicHistory, $state) {
    'use strict';

    function getQueryString(query) {
        query = query.split('?');
        query = query[1] || query[0];
        var queryString = {};
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof queryString[pair[0]] === "undefined") {
                queryString[pair[0]] = pair[1];
                // If second entry with this name
            } else if (typeof queryString[pair[0]] === "string") {
                var arr = [queryString[pair[0]], pair[1]];
                queryString[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                queryString[pair[0]].push(pair[1]);
            }
        }
        return queryString;
    }

    function showError() {
        $ionicPopup.alert({
            title: 'Error loading stream',
            template: 'There was an error when trying to add that stream.'
        });
    }

    function addStream(uri) {
        var qs = getQueryString(uri);

        var request = rest.one("api/stream", qs.streamKey).get();
        $ionicPlatform.ready(function () {
            request.then(function (response) {
                return $ionicPopup.confirm({
                    title: 'Join \"' + response.name + '\"',
                    template: 'Are you sure you want to join this slap stream?'
                });
            }, showError).then(function (response) {
                if (!response) {
                    return null;
                }

                return rest.all("api/subscription").post({ streamKey: qs.streamKey });
            }, showError).then(function (subscription) {
                if (!subscription) {
                    throw "Could not add subscription.";
                }

                if (!storage.subscriptions) {
                    storage.subscriptions = [];
                }

                storage.subscriptions = _.without(storage.subscriptions, _.findWhere(storage.subscriptions, { id: subscription.id }));
                storage.subscriptions.push(subscription);
                storage.subscriptions = _.sortBy(storage.subscriptions, 'id');

                // navigate to stream
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });

                $state.go('tab.streams.stream', { streamKey: qs.streamKey });
            }, showError);
        });
    }

    function activatedHandler(eventObject) {
        if (eventObject.detail.kind == Windows.ApplicationModel.Activation.ActivationKind.protocol) {
            var uri = eventObject.detail.uri;

            if (!uri) {
                return;
            }

            addStream(uri.absoluteUri);
        }
    }

    if (typeof WinJS !== 'undefined') {
        WinJS.Application.addEventListener("activated", activatedHandler, false);
    }
}]);