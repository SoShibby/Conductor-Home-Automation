angular.module('homeautomation')
    .controller('deviceSettings', ['$scope', '$stateParams', '$meteor',
        function($scope, $stateParams, $meteor) {
            $scope.devices = $meteor.collection(Devices);
        }
    ]);