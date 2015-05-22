angular.module('linkslap')
.run(['$window', '$rootScope', '$ionicPlatform', '$localStorage', '$ionicHistory', '$state',
function ($window, $rootScope, $ionicPlatform, storage, $ionicHistory, $state) {
    function addToStream(link) {
        var sub = _.find(storage.subscriptions, function (subscription) {
            return subscription.stream.key === link.streamKey;
        });

        link.newLink = true;
        sub.newLinks.push(link.id);
    }

    $ionicPlatform.ready(function() {
        if (!$window.device) {
            return;
        }

        if (device.platform == 'windows') {
            WinJS.Application.addEventListener("activated", function(eventObject) {
                if (eventObject.detail.kind !== Windows.ApplicationModel.Activation.ActivationKind.launch) {
                    return;
                }

                if (!eventObject.detail.arguments) {
                    return;
                }

                var link = JSON.parse(eventObject.detail.arguments);

                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });

                $state.go('tab.streams.stream.links', { streamKey: link.streamKey, linkId: link.id, link: link });
            }, false);
        }
    });
    $window.windowsEcb = function(json) {
        $rootScope.$apply(function() {
            addToStream(json);
        });

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

    $window.androidEcb = function(json) {
        switch (json.event) {
        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (json.foreground) {
                // do all the things
            } else { // otherwise we were launched because the user touched a notification in the notification tray.
                if (json.coldstart) {

                } else {

                }
            }

            //$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            //Only works for GCM
            //$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            //Only works on Amazon Fire OS
            //$status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
            break;

        case 'error':
            //$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;

        default:
            //$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
        }
    };
}]);

