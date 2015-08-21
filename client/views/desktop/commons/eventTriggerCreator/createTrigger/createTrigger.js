angular.module('homeautomation')
    .controller('createTrigger', ['$scope', '$stateParams', '$meteor', 'ModalService', 'close',
        function($scope, $stateParams, $meteor, ModalService, close) {
            $scope.close = close;
            $scope.triggers = [];

            $scope.selectDevice = function() {
                ModalService.showModal({
                    templateUrl: 'client/views/desktop/commons/eventTriggerCreator/selectDevice/selectDevice.ng.html',
                    controller: 'selectDevice',
                    inputs: {
                        devices: $meteor.collection(Devices, false)
                    }
                }).then(function(modal) {
                    modal.close.then(function(devices) {
                        var deviceTriggers = convertDevicesToTriggers(devices);
                        $scope.triggers = $scope.triggers.concat(deviceTriggers);
                    });
                });
            }

            $scope.selectCalendarEvent = function() {
                ModalService.showModal({
                    templateUrl: 'client/views/desktop/commons/eventTriggerCreator/selectCalendarEvent/selectCalendarEvent.ng.html',
                    controller: 'selectCalendarEvent',
                    inputs: {}
                }).then(function(modal) {
                    modal.close.then(function(calendarEventTrigger) {
                        $scope.triggers.push(calendarEventTrigger);
                    });
                });
            }

            $scope.selectDeviceLocation = function() {
                ModalService.showModal({
                    templateUrl: 'client/views/desktop/commons/eventTriggerCreator/selectDeviceLocation/selectDeviceLocation.ng.html',
                    controller: 'selectDeviceLocation',
                    inputs: {
                        devices: $meteor.collection(Devices, false)
                    }
                }).then(function(modal) {
                    modal.close.then(function(deviceLocationTrigger) {
                        $scope.triggers.push(deviceLocationTrigger);
                    });
                });
            }

            function convertDevicesToTriggers(devices) {
                var propertyTriggers = [];

                _.each(devices, function(device) {
                    if (device.selected) {
                        _.each(device.components, function(component) {
                            if (component.selected) {
                                _.each(component.properties, function(property, propertyName) {
                                    if (property.selected) {
                                        var trigger = {
                                            controlUnitId: device.controlUnitId,
                                            deviceId: device.id,
                                            componentId: component.id,
                                            propertyName: propertyName,
                                            propertyValue: property.value,
                                            triggerType: 'deviceProperty'
                                        }

                                        if(property.function) {
                                            trigger.function = property.function;
                                        }

                                        propertyTriggers.push(trigger);
                                    }
                                })
                            }
                        })
                    }
                });

                return propertyTriggers;
            }
        }
    ]);