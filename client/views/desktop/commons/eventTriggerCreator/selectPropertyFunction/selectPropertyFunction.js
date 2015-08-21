angular.module('homeautomation')
.controller('selectPropertyFunction', ['$scope', '$stateParams', '$meteor', 'property', 'close',
    function($scope, $stateParams, $meteor, property, close) {
        $scope.close = close;
        $scope.property = property;
        $scope.options = {};
        $scope.functions = {
            boolean: [
                {
                    name: 'toggle',
                    description: 'Toggle the value from true to false or vice versa'
                }
            ],
            integer: [
                {
                    name: 'increaseBy',
                    description: 'Increase Property Value By'
                },
                {
                    name: 'decreaseBy',
                    description: 'Decrease Property Value By'
                }
            ],
            string: [
                {
                    name: 'notEqual',
                    description: 'Triggers when the value is not equal to the following value'
                }
            ]
        };

        $scope.add = function(functionName, description, options) {
            close({
                name: functionName,
                description: description,
                options: options
            });
        }
    }
    ]);