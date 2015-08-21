angular.module('homeautomation')
    .controller('selectDeviceLocation', ['$scope', '$stateParams', '$meteor', 'ModalService', 'devices', 'close',
        function($scope, $stateParams, $meteor, ModalService, devices, close) {
            $scope.close = close;
            $scope.devices = devices;

            $scope.deviceViewer = {
                devices: $scope.devices,
                events: {
                    onDeviceSelected: function(device) {
                        ModalService.showModal({
                            templateUrl: "client/views/desktop/commons/eventTriggerCreator/selectLocation/selectLocation.ng.html",
                            controller: "selectLocation",
                            inputs: {
                                device: device
                            }
                        }).then(function(modal) {
                            modal.close.then(function(trigger) {
                                close(trigger);
                            });
                        });
                    }
                }
            }
        }
    ]);