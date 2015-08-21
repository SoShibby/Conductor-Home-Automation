angular.module('homeautomation').
directive('deviceBadgeViewer', function() {
    return {
        restrict: 'E',
        templateUrl: "client/views/desktop/commons/deviceBadgeViewer/deviceBadgeViewer.ng.html",
        scope: {
            devices: '=',
            hideFilter: '=',
            events: '='
        },
        controller: ['$scope', '$meteor', 'ModalService', function($scope, $meteor, ModalService) {
            $scope.controlUnits = $meteor.collection(ControlUnits).subscribe('controlUnits');
            $scope.deviceFilter = {};
            $scope.events = $scope.events || {};
            $scope.events.onDeviceSelected = $scope.events.onDeviceSelected || function() {};

            $scope.$watch('filterByControlUnit', function(controlUnit) {
                if (controlUnit) {
                    $scope.deviceFilter.controlUnitId = controlUnit.controlUnitId;
                } else {
                    delete $scope.deviceFilter['controlUnitId'];
                }
            });

            $scope.showDeviceDetails = function(device) {
                ModalService.showModal({
                    templateUrl: "client/views/desktop/commons/viewDeviceDetails/viewDeviceDetails.ng.html",
                    controller: "viewDeviceDetails",
                    inputs: {
                        device: device
                    }
                });
            }
        }]
    }
});