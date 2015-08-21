angular.module('homeautomation')
    .controller('lights', ['$scope', '$stateParams', '$meteor',
        function($scope, $stateParams, $meteor) {

            $scope.toggleLight = function(component) {
                var value = {
                    propertyValue: !component.properties.power.value
                };
                var filter = {
                    componentId: component.id,
                    propertyName: 'power'
                };

                $meteor.call('sendCommand', filter, value).then(
                    function(data) {
                        console.log('success');
                    },
                    function(err) {
                        console.log(err);
                    }
                );
            }

            $scope.sidebar = {
                items: _.pluck($meteor.collection(Locations), 'name'),
                fetchItemDescription: function(locationName) {
                    var components = ComponentFinder.find({
                        locationName: locationName,
                        componentType: 'light',
                        propertyName: 'power',
                        propertyValue: true
                    });

                    if (components.length === 0) {
                        return {
                            highlightedDescription: "",
                            description: "All lights are off"
                        };
                    } else if (components.length === 1) {
                        return {
                            highlightedDescription: "1",
                            description: " light is on"
                        };
                    } else {
                        return {
                            highlightedDescription: components.length,
                            description: " lights are on"
                        };
                    }
                },
                selected: function(locationName) {
                    console.log(locationName);

                    $scope.locationName = locationName;
                    var location = Locations.findOne({
                        name: locationName
                    });

                    console.log(location);

                    $scope.devices = $meteor.collection(function() {
                        return Devices.find({
                            $and: [{
                                'location.longitude': {
                                    $gte: location.northWest.longitude
                                }
                            }, {
                                'location.longitude': {
                                    $lte: location.southEast.longitude
                                }
                            }, {
                                'location.latitude': {
                                    $lte: location.northWest.latitude
                                }
                            }, {
                                'location.latitude': {
                                    $gte: location.southEast.latitude

                                }
                            }]
                        });
                        // $scope.devices = Devices.find({
                        //     locationName: locationName,
                        //     componentType: 'light'
                        // });
                    });
                }
            }
        }
    ]);