angular.module('homeautomation')
    .controller('selectLocation', ['$scope', '$stateParams', '$meteor', 'ModalService', 'device', 'close',
        function($scope, $stateParams, $meteor, ModalService, device, close) {
            $scope.close = close;
            $scope.locations = $meteor.collection(Locations);

            $scope.add = function() {
                var trigger = {
                    triggerType: 'deviceLocation',
                    controlUnitId: device.controlUnitId,
                    deviceId: device.id,
                    locationName: $scope.selectedLocation.name,
                    triggerWhen: $scope.triggerWhen
                }

                close(trigger);
            }
        }
    ]);