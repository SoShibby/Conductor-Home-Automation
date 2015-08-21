angular.module('homeautomation')
    .controller('sendCommandSettings', ['$scope', '$stateParams', '$meteor',
        function($scope, $stateParams, $meteor) {
            $scope.command = {
                filter: "\n \
{  \n \
    \"propertyName\": \"\"  \n \
}",
            };

            $scope.sendCommand = function(command) {
                var propertyValue = convertToDataType(command.propertyValue, command.dataType);
                var filter = JSON.parse(command.filter);

                $meteor.call("sendCommand", filter, {
                    propertyValue: propertyValue
                }).then(
                    function(data) {
                        console.log(data);
                    },
                    function(err) {
                        console.log(err);
                    })
            }

            function convertToDataType(value, dataType) {
                switch (dataType) {
                    case "integer":
                        return parseInt(value);
                    case "double":
                        return parseFloat(value);
                    case "boolean":
                        switch (value) {
                            case "true":
                                return true;
                            case "false":
                                return false;
                            default:
                                MessageBox.displayError("Error", "Invalid property value. Can't convert property value to boolean.");
                                return undefined;
                        }
                    case "string":
                        return value;
                    default:
                        MessageBox.displayError("Error", "Unsupported data type.");
                        return undefined;
                }
            }
        }
    ]);