angular.module('homeautomation')
    .controller('setDeviceLocation', ['$scope', '$stateParams', '$meteor', 'device', 'close',
        function($scope, $stateParams, $meteor, device, close) {
            $scope.close = close;
            $scope.device = device;

            $scope.map = {
                center: {
                    latitude: 59.37903727051661,
                    longitude: 13.49996566772461
                },
                zoom: 8,
                pan: true
            };

            $scope.marker = {
                coords: {
                    latitude: 59.37903727051661,
                    longitude: 13.49996566772461
                },
                options: {
                    draggable: true
                }
            }

            $scope.setDeviceLocation = function(device, longitude, latitude) {
                $meteor.call('setDeviceLocation', device.controlUnitId, device.id, longitude, latitude).then(
                    function(response) {
                        close();
                    },
                    function(error) {
                        alert('An error occured while setting device location. The error was: ' + error);
                    })
            }
        }
    ]);