angular.module('linkslap')
.run(['$window', '$rootScope', '$localStorage', function ($window, $rootScope, storage) {
    function addToStream(link) {
        var sub = _.find(storage.subscriptions, function (subscription) {
            return subscription.stream.key === link.streamKey;
        });

        link.newLink = true;
        sub.newLinks.push(link.id);
    }

    $window.windowsEcb = function (json) {
        $rootScope.$apply(function() {
            addToStream(json);
        });

        var notifications = Windows.UI.Notifications;

        var template = notifications.ToastTemplateType.toastImageAndText01;
        var toastXml = notifications.ToastNotificationManager.getTemplateContent(template);

        var toastTextElements = toastXml.getElementsByTagName("text");
        toastTextElements[0].appendChild(toastXml.createTextNode("Hello World!"));

        json.type = 'toast';
        toastXml.selectSingleNode("/toast").setAttribute("launch", JSON.stringify(json));

        var toast = new notifications.ToastNotification(toastXml);

        var toastNotifier = notifications.ToastNotificationManager.createToastNotifier();
        toastNotifier.show(toast);
    }
}]);

