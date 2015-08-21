angular.module('homeautomation')
    .controller('selectDevice', ['$scope', '$stateParams', '$meteor', 'ModalService', 'devices', 'close',
        function($scope, $stateParams, $meteor, ModalService, devices, close) {
            $scope.close = close;
            $scope.devices = devices;

            $scope.deviceViewer = {
                devices: $scope.devices,
                events: {
                    onDeviceSelected: function(device) {
                        $scope.selectComponent(device);
                    }
                }
            }

            $scope.selectComponent = function(device) {
                ModalService.showModal({
                    templateUrl: "client/views/desktop/commons/eventTriggerCreator/selectComponent/selectComponent.ng.html",
                    controller: "selectComponent",
                    inputs: {
                        components: device.components
                    }
                }).then(function(modal) {
                    modal.close.then(function(components) {
                        device.components = components;

                        var isAnyComponentSelected = _.some(device.components, function(component) {
                            return component.selected;
                        });

                        device.selected = isAnyComponentSelected;
                    });
                });
            }
        }
    ]);