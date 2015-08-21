angular.module('homeautomation').
directive('settingsMenu', function() {
    return {
        restrict: 'E',
        templateUrl: "client/views/desktop/settings/settingsMenu/settingsMenu.ng.html",
        scope: {},
        controller: ['$scope', function($scope) {

        }]
    }
});