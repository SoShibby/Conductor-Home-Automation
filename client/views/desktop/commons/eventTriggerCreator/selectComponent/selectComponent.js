angular.module('homeautomation')
    .controller('selectComponent', ['$scope', '$stateParams', '$meteor', 'ModalService', 'components', 'close',
        function($scope, $stateParams, $meteor, ModalService, components, close) {
            $scope.close = close;
            $scope.components = components;

            $scope.componentViewer = {
                components: $scope.components,
                events: {
                    onComponentSelected: function(component) {
                        $scope.selectProperty(component);
                    }
                }
            }

            $scope.selectProperty = function(component) {
                ModalService.showModal({
                    templateUrl: "client/views/desktop/commons/eventTriggerCreator/selectProperty/selectProperty.ng.html",
                    controller: "selectProperty",
                    inputs: {
                        properties: component.properties,
                    }
                }).then(function(modal) {
                    modal.close.then(function() {
                        var isAnyPropertySelected = _.some(component.properties, function(property) {
                            return property.selected;
                        });

                        component.selected = isAnyPropertySelected;
                    });
                });
            }
        }
    ]);