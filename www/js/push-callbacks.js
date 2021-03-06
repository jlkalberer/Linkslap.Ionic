﻿angular.module('linkslap')
.run(['$window', '$rootScope', '$ionicPlatform', '$localStorage', '$ionicHistory', '$state',
function ($window, $rootScope, $ionicPlatform, storage, $ionicHistory, $state) {
    function addToStream(link) {
        $rootScope.$apply(function () {
            var sub = _.find(storage.subscriptions, function (subscription) {
                return subscription.stream.key === link.streamKey;
            });

            link.newLink = true;
            sub.newLinks.push(link.id);
        });
    }

    function followLink(link) {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({
            historyRoot: true
        });

        $state.go('tab.streams.stream.links', { streamKey: link.streamKey, linkId: link.id, link: link });
    }

    $ionicPlatform.ready(function () {
        if (!$window.device) {
            return;
        }

        if (device.platform == 'windows') {
            WinJS.Application.addEventListener("activated", function (eventObject) {
                if (eventObject.detail.kind !== Windows.ApplicationModel.Activation.ActivationKind.launch) {
                    return;
                }

                if (!eventObject.detail.arguments) {
                    return;
                }

                var link = JSON.parse(eventObject.detail.arguments);

                followLink(link);
            }, false);
        }
    });
    $window.windowsEcb = function (json) {
        addToStream(json);

        var notifications = Windows.UI.Notifications;

        var template = notifications.ToastTemplateType.toastImageAndText01;
        var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);

        var toastTextElements = toastXml.getElementsByTagName("text");
        //toastTextElements[0].appendChild(toastXml.createTextNode("Linkslap"));
        toastTextElements[0].appendChild(toastXml.createTextNode("New link in " + json.streamName));

        json.type = 'toast';
        toastXml.selectSingleNode("/toast").setAttribute("launch", JSON.stringify(json));

        var toast = new notifications.ToastNotification(toastXml);
        toast.tag = json.id;
        toast.Tag = json.id;

        var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toast);
    };

    $window.androidEcb = function (json) {
        if (json.event !== 'message') {
            return;
        }

        var payload = json.payload.payload;

        if (json.foreground) {
            //followLink(payload);
        } else {
            addToStream(payload);
        }
    };
}]);

