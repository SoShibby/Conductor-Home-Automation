angular.module('homeautomation')
    .controller('createControlUnit', ['$scope', '$stateParams', '$meteor', 'close',
        function($scope, $stateParams, $meteor, close) {
            $scope.close = close;

            $scope.create = function(controlUnitName) {
                $meteor.call('addControlUnit', controlUnitName).then(
                    function(response) {
                        close();
                    },
                    function(error) {
                        alert("An error occurred when creating a new control unit. The error message was: " + error);
                    }
                );
            }
        }
    ]);