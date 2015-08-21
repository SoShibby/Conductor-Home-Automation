angular.module('homeautomation')
    .controller('viewComponentDetails', ['$scope', '$stateParams', '$meteor', 'device', 'component', 'close',
        function($scope, $stateParams, $meteor, device, component, close) {
            $scope.component = component;
            $scope.close = close;

            $scope.updateComponentName = function(device, component, newComponentName) {
                $meteor.call('setDeviceName', device.controlUnitId, device.id, component.id, newComponentName).then(
                    function() {
                        $scope.componentNameChanged = false;
                    },
                    function(error) {
                        alert('An error occured while updating component name. The error was: ' + error);
                    })
            }
        }
    ]);