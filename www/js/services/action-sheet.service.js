angular.module('linkslap.services')
.factory("actionSheet", [
    '$rootScope', '$window', '$ionicActionSheet', 'auth', '$localStorage', '$stateParams',
    function($rootScope, $window, $ionicActionSheet, auth, $localStorage, $stateParams) {
        var buttons = [
            {
                text: '<b>Share</b>',
                callback: function() {
                    var userName = $localStorage.authDetails.userName;
                    var message = userName + " invited you to Linkslap";
                    var url = "https://linkslap.me";

                    if ($stateParams.streamKey) {
                        var stream = _.find($localStorage.subscriptions, function(s) {
                            return s.stream.key === $stateParams.streamKey;
                        }).stream;
                        message = userName + " invited you to \"" + stream.name + "\" on Linkslap";
                        url += "/s/" + stream.key;
                    }

                    $window.plugins.socialsharing.share("Linkslap", message, null, url);
                }
            },
            { text: 'New Stream' },
            { text: 'Settings' },
            {
                text: 'Log Out',
                callback: function() {
                    auth.logout();
                }
            }
        ];
        return {
            showActionSheet: function() {
                var hideSheet = $ionicActionSheet.show({
                    buttons: buttons,
                    buttonClicked: function(index, button) {
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