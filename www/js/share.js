var share = (function () {
    'use strict';

    function alert(message) {
        var msgBox = new Windows.UI.Popups.MessageDialog(message);
        msgBox.showAsync();
    }

    var shareOperation;
    function activatedHandler(eventObject) {
        // In this sample we only do something if it was activated with the Share contract
        if (eventObject.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.shareTarget) {
            eventObject.setPromise(WinJS.UI.processAll());

            // We receive the ShareOperation object as part of the eventArgs
            shareOperation = eventObject.detail.shareOperation;

            // We queue an asychronous event so that working with the ShareOperation object does not
            // block or delay the return of the activation handler.
            WinJS.Application.queueEvent({ type: "shareready" });
        }
    }

    function shareReady() {
        shareOperation.data.getWebLinkAsync().done(function (webLink) {
            share.callback(webLink.rawUri);
        }, function (e) {
            alert("Error retrieving data: " + e);
        });
    }

    if (typeof WinJS !== 'undefined') {
        WinJS.Application.addEventListener("activated", activatedHandler, false);
        WinJS.Application.addEventListener("shareready", shareReady, false);
    } else {
        // Hack but I don't want to try injecting angular shit...
        document.addEventListener("deviceready", function () {
            window.plugins.webintent.getExtra(window.plugins.webintent.EXTRA_TEXT, share.callback);

            window.plugins.webintent.onNewIntent(function () {
                window.plugins.webintent.getExtra(window.plugins.webintent.EXTRA_TEXT, share.callback);
            });
        });
    }


    return {
        callback: function () { }
    };
})();