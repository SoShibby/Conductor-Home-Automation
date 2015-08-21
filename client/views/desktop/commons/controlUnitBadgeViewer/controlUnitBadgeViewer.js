angular.module('homeautomation').
directive('controlUnitBadgeViewer', function() {
    return {
        restrict: 'E',
        templateUrl: "client/views/desktop/commons/controlUnitBadgeViewer/controlUnitBadgeViewer.ng.html",
        scope: {
            controlUnits: '='
        },
        controller: ['$scope', '$meteor', 'ModalService', function($scope, $meteor, ModalService) {
            $scope.showControlUnitDetails = function(controlUnit) {
                ModalService.showModal({
                    templateUrl: "client/views/desktop/commons/viewControlUnitDetails/viewControlUnitDetails.ng.html",
                    controller: "viewControlUnitDetails",
                    inputs: {
                        controlUnit: controlUnit
                    }
                });
            }

            $scope.createControlUnit = function() {
                ModalService.showModal({
                    templateUrl: "client/views/desktop/commons/createControlUnit/createControlUnit.ng.html",
                    controller: "createControlUnit"
                });
            }
        }]
    }
});