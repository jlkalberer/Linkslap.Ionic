// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('linkslap', [
    'ionic',
    'linkslap.controllers',
    'linkslap.services',
    'linkslap.directives',
    'ngStorage',
    'restangular',
    'img-src-ondemand'
])

.run(function ($ionicPlatform, $rootScope, auth, $ionicHistory, $state, $localStorage, $ionicActionSheet) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }

        if (typeof device !== 'undefined' && device.platform == "windows") {
            // Get the back button working in WP8.1
            WinJS.Application.onbackclick = function () {
                if (!$ionicHistory.backView()) {
                    window.close();

                    return false;
                }

                $ionicHistory.goBack();
                return true; // This line is important, without it the app closes.
            }
        }

        $localStorage.$default({
            'settings': {
                pushNotifications: true,
                manageLocations: false
            }
        });
    });

    $rootScope.$on('$stateChangeStart',
    function (event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !auth.isLoggedIn()) {
            $ionicPlatform.ready(function () {
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });

                $state.go('login');
            });
        }
    });

    $rootScope.showActionSheet = function () {
        console.log("showAS");
        var hideSheet = $ionicActionSheet.show({
            buttons: [
              { text: 'New Stream' },
              { text: 'Settings' },
              { text: 'Log Out' }
            ],
            buttonClicked: function (index) {

                if (index === 2) {
                    auth.logout();
                }

                return true;
            }
        });
    };
})
.config(function($sceProvider) {
    $sceProvider.enabled(false);
})
/*.config(function($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
})*/
.config(function ($stateProvider, $urlRouterProvider, RestangularProvider) {

    //RestangularProvider.setBaseUrl('https://linkslap.me/');
    RestangularProvider.setBaseUrl('http://localhost:50328/');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // Each tab has its own nav history stack:
    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
    })

    .state('register', {
        url: "/register",
        templateUrl: "templates/register.html",
        controller: 'RegisterCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    .state('tab.search', {
        authenticate: true,
        url: '/search',
        views: {
            'tab-search': {
                templateUrl: 'templates/tab-search.html',
                controller: 'SearchCtrl'
            }
        }
    })
    .state('tab.search.share', {
        authenticate: true,
        url: '/share/:url',
        views: {
            'tab-search@tab': {
                templateUrl: 'templates/tab-share.html',
                controller: 'ShareCtrl'
            }
        }
    })

    .state('tab.streams', {
        authenticate: true,
        url: '/streams',
        views: {
            'tab-streams': {
                templateUrl: 'templates/tab-streams.html',
                controller: 'StreamsCtrl'
            }
        }
    })
    .state('tab.streams.stream', {
        authenticate: true,
        url: '/stream/:streamKey',
        views: {
            'tab-streams@tab': {
                templateUrl: 'templates/tab-stream.html',
                controller: 'StreamCtrl'
            }
        }
    })
    .state('tab.streams.stream.links', {
        authenticate: true,
        url: '/links/:linkId/:page',
        views: {
            'tab-streams@tab': {
                templateUrl: 'templates/tab-links.html',
                controller: 'LinksCtrl'
            }
        }
    })

    .state('tab.account', {
        authenticate: true,
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/search');
});
