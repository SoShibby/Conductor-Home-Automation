angular.module('homeautomation').
directive('footer', function() {
    return {
        restrict: 'A',
        templateUrl: "client/layouts/desktop/footer.ng.html",
        scope: {},
        controller: ['$scope', '$state', function($scope, $state) {

        }]
    }
});