angular.module('homeautomation')
    .controller('controlUnitSettings', ['$scope', '$stateParams', '$meteor',
        function($scope, $stateParams, $meteor) {
            $scope.controlUnits = $meteor.collection(ControlUnits);
        }
    ]);