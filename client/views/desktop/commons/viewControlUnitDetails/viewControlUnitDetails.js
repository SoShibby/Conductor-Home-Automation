angular.module('homeautomation')
    .controller('viewControlUnitDetails', ['$scope', '$stateParams', '$meteor', 'controlUnit', 'close',
        function($scope, $stateParams, $meteor, controlUnit, close) {
            console.log(controlUnit);
            $scope.controlUnit = controlUnit;
            $scope.close = close;
            $scope.devices = $meteor.collection(function() {
                return Devices.find({ controlUnitId: $scope.controlUnit.controlUnitId });
            }).subscribe('devices');
        }
    ]);