angular.module('homeautomation').
directive('header', function() {
    return {
        restrict: 'A',
        templateUrl: "client/layouts/desktop/header.ng.html",
        scope: {},
        controller: ['$scope', '$interval', function($scope, $interval) {
            $interval(function() {
                $scope.time = moment().format('hh:mmA');
                $scope.date = moment().format('M MMMM YYYY');
            }, 1000);
        }]
    }
});