angular.module('homeautomation')
    .controller('createAction', ['$scope', '$stateParams', '$meteor', 'ModalService', 'close',
        function($scope, $stateParams, $meteor, ModalService, close) {
            $scope.close = close;

            ModalService.showModal({
                templateUrl: 'client/views/desktop/commons/eventTriggerCreator/selectDevice/selectDevice.ng.html',
                controller: 'selectDevice',
                inputs: {
                    devices: $meteor.collection(Devices, false)
                }
            }).then(function(modal) {
                modal.close.then(function(devices) {
                    var deviceActions = convertDevicesToActions(devices);
                    console.log(deviceActions);
                    close(deviceActions);
                });
            });

            function convertDevicesToActions(devices) {
                var actions = [];

                _.each(devices, function(device) {
                    if (device.selected) {
                        _.each(device.components, function(component) {
                            if (component.selected) {
                                _.each(component.properties, function(property, propertyName) {
                                    if (property.selected) {
                                        var action = {
                                            filter: {
                                                controlUnitId: device.controlUnitId,
                                                deviceId: device.id,
                                                componentId: component.id,
                                                propertyName: propertyName
                                            },
                                            value: {
                                                propertyValue: property.value
                                            }
                                        };

                                        if (property.function) {
                                            action.function = property.function;
                                        }

                                        actions.push(action);
                                    }
                                });
                            }
                        });
                    }
                });

                return actions;
            }
        }
    ]);