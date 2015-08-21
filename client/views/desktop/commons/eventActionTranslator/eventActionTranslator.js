angular.module('homeautomation').
directive('eventActionTranslator', function() {
    return {
        restrict: 'E',
        templateUrl: "client/views/desktop/commons/eventActionTranslator/eventActionTranslator.ng.html",
        scope: {
            action: '=',
        },
        controller: ['$scope', '$meteor', function($scope, $meteor) {
            if($scope.action && $scope.action.filter.controlUnitId && $scope.action.filter.deviceId){
               $scope.device = Devices.findOne({
                    controlUnitId: $scope.action.filter.controlUnitId,
                    id: $scope.action.filter.deviceId
                });
            }
        }]
    }
});