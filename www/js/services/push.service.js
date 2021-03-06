﻿angular.module('linkslap.services')
.factory('push', [
'$window', '$ionicPlatform', '$q', 'Restangular', '$localStorage',
function ($window, $ionicPlatform, $q, rest, $localStorage) {
    var platform = '',
        deviceToken = '',
        uidDefer = $q.defer(),
        channelDefer = $q.defer();

    function successHandler(result) {
        if (!result.uri) {
            return;
        }

        channelDefer.resolve(result);
        console.log('registered###' + result.uri);
        // send uri to your notification server
    }
    function errorHandler(error) {
        channelDefer.reject(error);
        console.log('error###' + error);
    }

    $window.handleAndroid = function (response) {
        if (response.event === 'registered') {
            if (response.regid.length) {
                channelDefer.resolve({ uri: '' });
                deviceToken = response.regid;
            } else {
                channelDefer.reject("No registration ID");
            }
        } else if (window.androidEcb) {
            window.androidEcb(response);
        }
    };

    function iosTokenHandler(token) {
        deviceToken = token;
    }

    function setup() {
        if (!window.plugins) {
            return;
        }

        var pushNotification = window.plugins.pushNotification;
        window.plugins.uniqueDeviceID.get(uidDefer.resolve, uidDefer.reject);

        if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
            platform = 'gcm';
            pushNotification.register(
                successHandler,
                errorHandler,
                {
                    "senderID": "254306377364",
                    "ecb": "handleAndroid"
                });
        } else if (device.platform == 'windows') {
            platform = 'windows';

            // Push notifications in a background service causes WP8.1 to crash so
            // push notifications are only used in Windows 10 and greater
            if (WinJS.Utilities.isPhone) {
                //pushNotification.register(successHandler, errorHandler,
                //    {
                //        "ecb": 'windowsEcb'
                //    });
                //pushNotification.registerBackground(successHandler, errorHandler,
                //    {
                //        "entryPoint": "PushPlugin.PushBackgroundTask",
                //    });

                PushPlugin.PushSetup.run().then(function(channel) {
                    channelDefer.resolve(channel);
                });
            } else {
                pushNotification.registerBackground(successHandler, errorHandler,
                    {
                        "entryPoint": "PushPlugin.PushBackgroundTask",
                        "importScript": "/www/js/push-callbacks.js",
                        "callback": 'windowsEcb'
                    });
            }
        } else {
            platform = 'ios';
            pushNotification.register(
                iosTokenHandler,
                errorHandler,
                {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true",
                    "ecb": "iosEcb"
                });
        }
    }

    $ionicPlatform.ready(setup);

    return {
        register: function () {
            return $q.all([uidDefer.promise, channelDefer.promise])
                .then(function (values) {
                    return rest.all('api/push/register').post({
                        platform: platform,
                        installationId: values[0],
                        channelUri: values[1].uri,
                        deviceToken: deviceToken
                    });
                });
        },
        unregister: function () {

        }
    };
}]);
