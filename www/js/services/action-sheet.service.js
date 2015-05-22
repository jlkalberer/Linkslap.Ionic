angular.module('linkslap.services')
.factory("actionSheet", [
    '$rootScope', '$window', '$ionicActionSheet', 'auth', '$localStorage', '$stateParams', '$ionicPopup', 'Restangular', '$ionicHistory', '$state',
    function ($rootScope, $window, $ionicActionSheet, auth, storage, $stateParams, $ionicPopup, rest, $ionicHistory, $state) {
        function showError() {
            $ionicPopup.alert({
                title: 'Error creating stream',
                template: 'There was an error when trying to create a new stream.'
            });
        }

        function showNewStreamPopup() {
            $rootScope.newStreamData = {};
            $ionicPopup.show({
                template: '<input type="text" ng-model="newStreamData.name">',
                title: 'Enter new stream name',
                subTitle: 'The stream name should be somewhat unique so you can share it with your friends.',
                scope: $rootScope,
                buttons: [
                  { text: 'Cancel' },
                  {
                      text: '<b>Save</b>',
                      type: 'button-positive',
                      onTap: function (e) {
                          if (!$rootScope.newStreamData.name) {
                              //don't allow the user to close unless he enters wifi password
                              e.preventDefault();
                          } else {
                              return $rootScope.newStreamData.name;
                          }
                      }
                  }
                ]
            }).then(function (streamName) {
                return rest.all('api/stream').post({ name: streamName });
            }, showError)
            .then(function (subscription) {
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

                $state.go('tab.streams.stream', { streamKey: subscription.stream.key });
            }, showError);
        }

        var buttons = [
            {
                text: '<b>Share</b>',
                callback: function () {
                    var userName = storage.authDetails.userName;
                    var message = userName + " invited you to Linkslap";
                    var url = "https://linkslap.me";

                    if ($stateParams.streamKey) {
                        var stream = _.find(storage.subscriptions, function (s) {
                            return s.stream.key === $stateParams.streamKey;
                        }).stream;
                        message = userName + " invited you to \"" + stream.name + "\" on Linkslap";
                        url += "/s/" + stream.key;
                    }

                    $window.plugins.socialsharing.share("Linkslap", message, null, url);
                }
            },
            {
                text: 'New Stream',
                callback: showNewStreamPopup
            },
           // { text: 'Settings' },
            {
                text: 'Log Out',
                callback: function () {
                    auth.logout();
                }
            }
        ];
        return {
            showActionSheet: function () {
                $ionicActionSheet.show({
                    buttons: buttons,
                    buttonClicked: function (index, button) {
                        if (button.callback) {
                            button.callback();
                        }

                        return true;
                    }
                });
            }
        };
    }
]);