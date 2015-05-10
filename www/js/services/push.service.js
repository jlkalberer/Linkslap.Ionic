angular.module('linkslap.services')
.factory('push', [
'$window', '$ionicPlatform', '$q', 'Restangular', '$state', '$ionicHistory',
function ($window, $ionicPlatform, $q, rest, $state, $ionicHistory) {
    var platform = '',
        deviceToken = '',
        uidDefer = $q.defer(),
        channelDefer = $q.defer();

    function successHandler(result) {
        channelDefer.resolve(result);
        console.log('registered###' + result.uri);
        // send uri to your notification server
    }
    function errorHandler(error) {
        channelDefer.reject(error);
        console.log('error###' + error);
    }

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
                    "senderID": "replace_with_sender_id",
                    "ecb": "androidEcb"
                });
        } else if (device.platform == 'windows') {
            platform = 'windows';
            pushNotification.registerBackground(successHandler, errorHandler,
                {
                    "channelName": "linkslap",
                    "importScript": "/www/js/push-callbacks.js",
                    "callback": 'windowsEcb'
                });
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
