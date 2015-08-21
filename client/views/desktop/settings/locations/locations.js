angular.module('homeautomation')
    .controller('locations', ['$scope', '$stateParams', '$meteor', '$location', '$anchorScroll', 'ModalService',
        function($scope, $stateParams, $meteor, $location, $anchorScroll, ModalService) {
            $scope.devices = $meteor.collection(Devices);
            $scope.locations = $meteor.collection(Locations);
            $scope.rectangles = {};

            $scope.map = {
                center: {
                    latitude: 59.37903727051661,
                    longitude: 13.49996566772461
                },
                zoom: 8,
                pan: true
            }

            $scope.deviceView = {
                events: {
                    onDeviceSelected: function(device) {
                        if(!device.location){
                            alert('No location exist for this device.');
                            return;
                        }

                        $scope.map.center = _.extend(device.location, {});  // Copy the device location to the maps center location
                        $scope.map.zoom = 17;
                        $location.hash('map');
                        $anchorScroll();
                    }
                }
            }

            $scope.viewLocation = function(location) {
                $scope.map.bounds = {
                    northeast: {
                        latitude: location.northWest.latitude,
                        longitude: location.southEast.longitude
                    },
                    southwest: {
                        latitude: location.southEast.latitude,
                        longitude: location.northWest.longitude
                    }
                }
            }

            Locations.find().observe({
                added: function(location) {
                    // Show a rectangle on the map for this location
                    var rectangle = new google.maps.LatLngBounds(
                        new google.maps.LatLng(location.southEast.latitude, location.northWest.longitude),
                        new google.maps.LatLng(location.northWest.latitude, location.southEast.longitude)
                    )

                    $scope.rectangles[location._id] = rectangle;
                },
                removed: function(location) {
                    // Remove the rectangle from the map
                    delete $scope.rectangles[location._id];
                }
            });

            $scope.addLocation = function() {
                ModalService.showModal({
                    templateUrl: "client/views/desktop/commons/addLocation/addLocation.ng.html",
                    controller: "addLocation",
                });
            }

            $scope.removeLocation = function(location) {
                $meteor.call('removeLocation', location._id).then(
                    function(response) {
                        alert('Location removed successfully!');
                    },
                    function(error) {
                        alert('An error occured while removing location. The error was: ' + error);
                    });
            }
        }
    ]);

// function getBoundsZoomLevel(bounds, mapDim) {
//     var WORLD_DIM = { height: 256, width: 256 };
//     var ZOOM_MAX = 21;

//     function latRad(lat) {
//         var sin = Math.sin(lat * Math.PI / 180);
//         var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
//         return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
//     }

//     function zoom(mapPx, worldPx, fraction) {
//         return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
//     }

//     var ne = bounds.getNorthEast();
//     var sw = bounds.getSouthWest();

//     var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

//     var lngDiff = ne.lng() - sw.lng();
//     var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

//     var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
//     var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

//     return Math.min(latZoom, lngZoom, ZOOM_MAX);
// }