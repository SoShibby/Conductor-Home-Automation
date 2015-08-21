angular.module('homeautomation')
    .controller('addLocation', ['$scope', '$stateParams', '$meteor', 'close',
        function($scope, $stateParams, $meteor, close) {
            $scope.close = close;
            $scope.currentRectangleBounds = undefined;

            $scope.map = {
                center: {
                    latitude: 59.37903727051661,
                    longitude: 13.49996566772461
                },
                zoom: 8,
                pan: true
            };

            $scope.rectangle = {
                bounds: new google.maps.LatLngBounds(
                    new google.maps.LatLng(59.350911963131786, 13.33517074584961),
                    new google.maps.LatLng(59.44035755347623, 13.62630844116211)
                ),
                events: {
                    bounds_changed: function(rectangle) {
                        $scope.currentRectangleBounds = rectangle.bounds;
                    }
                }
            };

            $scope.addLocation = function(locationName, bounds) {
                var ne = bounds.getNorthEast(); // Get North-East coordinate of the rectangle
                var sw = bounds.getSouthWest(); // Get the South-West coordinate of the rectangle

                $meteor.call('addLocation', locationName, sw.lng(), ne.lat(), ne.lng(), sw.lat()).then(
                    function(response) {
                        alert('Location added successfully!');
                        close();
                    },
                    function(error) {
                        alert('Failed to add a new location. The error was: ' + error);
                    });
            }
        }
    ]);

// function getBoundsByPercentage(map, percentage) {
//     var latNE = map.getBounds().getNorthEast().lat();
//     var lngNE = map.getBounds().getNorthEast().lng();
//     var latSE = map.getBounds().getSouthWest().lat();
//     var lngSE = map.getBounds().getSouthWest().lng();

//     var latDiff = latNE - latSE;
//     var lngDiff = lngNE - lngSE;

//     var bounds = new google.maps.LatLngBounds(
//         new google.maps.LatLng(latSE + latDiff * (1 - percentage), lngSE + lngDiff * (1 - percentage)),
//         new google.maps.LatLng(latSE + latDiff * percentage, lngSE + lngDiff * percentage)
//     );

//     return bounds;
// }