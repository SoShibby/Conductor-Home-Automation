angular.module('homeautomation').
directive('slider', function() {
    return {
        restrict: 'E',
        templateUrl: "client/views/desktop/commons/slider/slider.ng.html",
        scope: {
            value: '=',
            max: '=',
            min: '='
        },
        controller: ['$scope', function($scope) {
            $scope.$watch('value', function(value) {
                $scope.popupLeft = ($scope.value / ($scope.max - $scope.min)) * 100;
            });
        }]
    }
});