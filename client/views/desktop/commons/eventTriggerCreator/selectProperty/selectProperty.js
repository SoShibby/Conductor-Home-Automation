angular.module('homeautomation')
    .controller('selectProperty', ['$scope', '$stateParams', '$meteor', 'properties', 'ModalService', 'close',
        function($scope, $stateParams, $meteor, properties, ModalService, close) {
            $scope.close = close;
            $scope.properties = properties;

            $scope.selectPropertyFunction = function(property) {
                ModalService.showModal({
                    templateUrl: "client/views/desktop/commons/eventTriggerCreator/selectPropertyFunction/selectPropertyFunction.ng.html",
                    controller: "selectPropertyFunction",
                    inputs: {
                        property: property
                    }
                }).then(function(modal) {
                    modal.close.then(function(propertyFunction) {
                        property.function = propertyFunction;
                    });
                });
            }

            $scope.removeFunction = function(property) {
                delete property['function'];
            }
        }
    ]);