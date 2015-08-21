angular.module('homeautomation')
    .controller('viewDeviceDetails', ['$scope', '$stateParams', '$meteor', 'device', 'ModalService', 'close',
        function($scope, $stateParams, $meteor, device, ModalService, close) {
            $scope.device = device;
            $scope.close = close;
            $scope.deviceName = device.name;

            $scope.map = {
                center: {
                    latitude: 59.37903727051661,
                    longitude: 13.49996566772461
                },
                zoom: 8,
                pan: true
            };

            $scope.marker = {
                options: {
                    draggable: true
                }
            }

            $scope.updateDeviceName = function(device, newDeviceName) {
                $meteor.call('setDeviceName', device.controlUnitId, device.id, newDeviceName).then(
                    function() {
                        $scope.deviceNameChanged = false;
                    },
                    function(error) {
                        alert('An error occured while updating device name. The error was: ' + error);
                    })
            }

            $scope.changeDeviceLocation = function(device) {
                ModalService.showModal({
                    templateUrl: "client/views/desktop/commons/setDeviceLocation/setDeviceLocation.ng.html",
                    controller: "setDeviceLocation",
                    inputs: {
                        device: device
                    }
                });
            }
        }
    ]);