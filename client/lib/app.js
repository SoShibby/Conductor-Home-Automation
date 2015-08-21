angular.module('homeautomation', ['angular-meteor', 'ui.router', 'angularMoment', 'angularModalService', 'uiGmapgoogle-maps']);

angular.module('homeautomation').run(["$rootScope", "$state", 'ModalService', function($rootScope, $state, ModalService) {
  ModalService.showModal({
    templateUrl: "client/views/desktop/commons/messagebox/messagebox.ng.html",
    controller: "messageBoxHandler"
  });

  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error === "AUTH_REQUIRED") {
      $state.go('login');
    }
  });
}]);

angular.module('homeautomation').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $stateProvider
    // Login
      .state('login', {
        url: '/login',
        templateUrl: 'client/views/desktop/account/login/login.ng.html',
        controller: 'login'
      })
       // Create Account
      .state('createAccount', {
        url: '/create-account',
        templateUrl: 'client/views/desktop/account/create/createAccount.ng.html',
        controller: 'createAccount'
      })
      // Logout
      .state('logout', {
        url: '/logout',
        resolve: {
          "logout": ['$meteor', '$state', function($meteor, $state) {
            return $meteor.logout().then(function() {
              $state.go('login');
            }, function(error) {
              console.log('logout error - ', error);
            });
          }]
        }
      })
      // Dashboard
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'client/views/desktop/dashboard/dashboard.ng.html',
        controller: 'dashboard',
        resolve: {
          "currentUser": ['$meteor', function($meteor) {
            return $meteor.requireUser();
          }],
          'subscribe': [
            '$meteor',
            function($meteor) {
              return $meteor.subscribe('confirmedFriends') && $meteor.subscribe('myProfile');
            }
          ]
        }
      })
      // Lights
      .state('lights', {
        url: '/lights',
        templateUrl: 'client/views/desktop/lights/lights.ng.html',
        controller: 'lights',
        resolve: {
          'subscribe': [
            '$meteor',
            function($meteor) {
              return $meteor.subscribe('devices') && $meteor.subscribe('locations');
            }
          ]
        }
      })
      // Settings
      .state('settings', {
        url: '/settings',
        abstract: true,
        template: '<ui-view/>',
        controller: ['$scope', '$state',
          function($scope, $state) {
            $state.go('settings.controlUnit');
          }
        ]
      })
      // Settings.ControlUnit
      .state('settings.controlUnit', {
        url: '/controlUnit',
        templateUrl: 'client/views/desktop/settings/controlUnit/controlUnit.ng.html',
        controller: 'controlUnitSettings',
        resolve: {
          'subscribe': [
            '$meteor',
            function($meteor) {
              return $meteor.subscribe('controlUnits');
            }
          ]
        }
      })
      // Settings.Device
      .state('settings.device', {
        url: '/device',
        templateUrl: 'client/views/desktop/settings/device/device.ng.html',
        controller: 'deviceSettings',
        resolve: {
          'subscribe': [
            '$meteor',
            function($meteor) {
              return $meteor.subscribe('devices');
            }
          ]
        }
      })
      // Settings.Locations
      .state('settings.locations', {
        url: '/locations',
        templateUrl: 'client/views/desktop/settings/locations/locations.ng.html',
        controller: 'locations',
        resolve: {
          'subscribe': [
            '$meteor',
            function($meteor) {
              return $meteor.subscribe('locations') && $meteor.subscribe('devices');
            }
          ]
        }
      })
      // Settings EventTriggers
      .state('settings.eventTriggers', {
        url: '/event-triggers',
        templateUrl: 'client/views/desktop/settings/eventTrigger/eventTrigger.ng.html',
        controller: 'eventTriggerSettings',
        resolve: {
          'subscribe': [
            '$meteor',
            function($meteor) {
              return $meteor.subscribe('triggerActions') && $meteor.subscribe('devices') && $meteor.subscribe('controlUnits') && $meteor.subscribe('locations');
            }
          ]
        }
      })
      // Settings.Calendar
      .state('settings.calendar', {
        url: '/calendar',
        templateUrl: 'client/views/desktop/settings/calendar/calendar.ng.html',
        controller: 'calendarSettings',
        resolve: {
          'subscribe': [
            '$meteor',
            function($meteor) {
              return $meteor.subscribe('feeds');
            }
          ]
        }
      })
      // Settings.SendCommand
      .state('settings.sendCommand', {
        url: '/send-command',
        templateUrl: 'client/views/desktop/settings/sendCommand/sendCommand.ng.html',
        controller: 'sendCommandSettings'
      })
      // Settings.Device Access
      .state('settings.deviceAccess', {
        url: '/device-access',
        templateUrl: 'client/views/desktop/settings/deviceAccess/deviceAccess.ng.html',
        controller: 'deviceAccessSettings',
        resolve: {
          'subscribe': [
            '$meteor',
            function($meteor) {
              return $meteor.subscribe('devices') && $meteor.subscribe('confirmedFriends') && $meteor.subscribe('unconfirmedFriends') && $meteor.subscribe('friendRequests') && $meteor.subscribe('myProfile');
            }
          ]
        }
      })

    $urlRouterProvider.otherwise('/dashboard');
  }
])
.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})