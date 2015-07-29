var rectangles = {};    // Collection of rectangles that are displayed on the map
var markers = {};       // Collection of markers that are displayed on the map
var map;                // Google map instance
var selectedUser = new ReactiveVar(undefined);          // Device owner filter
var selectedControlUnit = new ReactiveVar(undefined);   // Control unit filter

Template.DeviceLocationSettings.helpers({
    mapOptions: function() {
        if (GoogleMaps.loaded()) {
            return {
                // Just set the map to some random start position
                center: new google.maps.LatLng(59.37903727051661, 13.49996566772461),
                zoom: 8
            };
        }
    },
    devices: function(){
        var selectedUserId = selectedUser.get();    // Get device owner filter
        var selectedControlUnitId = selectedControlUnit.get(); // Get control unit filter

        // If no filters are set then display all devices
        if(!selectedUserId && !selectedControlUnitId)
            return Devices.find().fetch();

        var filter = {};

        // Filter devices by owner if the owner filter is set
        if(selectedUserId){
            filter.owner = selectedUserId;
        }

        // Filter by control unit if the control unit filter is set
        if(selectedControlUnitId){
            filter.controlUnitId = selectedControlUnitId;
        }

        // Fetch all devices that matches the filter
        var controlUnits = ControlUnits.find(filter).fetch();
        var controlUnitIds = controlUnits.map(function(controlUnit){ return controlUnit.controlUnitId });
        return Devices.find({ controlUnitId: { $in: controlUnitIds} }).fetch();
    },
    users: function(){
        var user = Meteor.user();

        if(!user || !user.friends)
            return [];

        // Fetch all friends and display them in the owner filter
        return Meteor.users.find({ _id: { $in: user.friends.confirmed }});
    },
    controlUnits: function(){
        var selectedUserId = selectedUser.get();

        // Fetch control units and display them in the control unit filter
        if(selectedUserId){
            return ControlUnits.find({ owner: selectedUserId }).fetch();
        }else{
            return ControlUnits.find().fetch();
        }
    }
});

Template.DeviceLocationSettings.events({
    /* Show popup for adding new location area */
    'click .js-add-location': function(event, template) {
        var body = $('body')[0];
        Blaze.render(Template.AddLocation, body);
    },
    /* Remove location area */
    'click .js-remove-location': function(event, template) {
        var locationId = template.$('.js-selected-location').val();

        Meteor.call('removeLocation', locationId, function(error, result){
            if(error){
                MessageBox.displayInfo("Failed to remove location", "An error occurred when removing location. The error message was: " + error);
            }
        });
    },
    /* Show device information popup */
    'click .js-info': function(event, template) {
        var body = $('body')[0];
        Blaze.renderWithData(Template.ViewDevice, { deviceId: this.id }, body);
        return false;
    },
    /* Filter devices by owner */
    'change .filter.user select': function(event, template) {
        var select = template.find('.filter.user select');
        var userId = select.value;

        if(userId === "")
            selectedUser.set(undefined);
        else
            selectedUser.set(userId);

        $(template.find('.filter.control-unit select')).val("").change();   //select the "show all" option in the control units filter
    },
    /* Filter devices by control unit */
    'change .filter.control-unit select': function(event, template) {
        var select = template.find('.filter.control-unit select');
        var controlUnitId = select.value;

        if(controlUnitId === "")
            selectedControlUnit.set(undefined);
        else
            selectedControlUnit.set(controlUnitId);
    },
    /* Move the map to a selected location area */
    'click .js-view-location': function(event, template) {
        var locationId = template.$('.js-selected-location').val();
        var location = Locations.findOne(locationId);

        var bounds = new google.maps.LatLngBounds(
                        new google.maps.LatLng(location.southEast.latitude, location.northWest.longitude),
                        new google.maps.LatLng(location.northWest.latitude, location.southEast.longitude)
                     );

        map.setCenter(bounds.getCenter());

        var mapDimension = {
            width: $('#map').width(),
            height: $('#map').height()
        };

        map.setZoom(getBoundsZoomLevel(bounds, mapDimension));

        scrollTo('#map', '.settings.device-location');
    },
    /* Move the map to the device location when user clicks on the device */
    'click .js-view-device-location': function(event, template) {
        // Check if the device has a location
        if(!this.location || this.location.longitude === undefined || this.location.latitude === undefined) {
            MessageBox.displayInfo("No device location found", "No device location was found for this device");
            return;
        }

        map.setCenter(new google.maps.LatLng(this.location.latitude, this.location.longitude));
        map.setZoom(16);

        scrollTo('#map', '.settings.device-location');
    }
});

Template.DeviceLocationSettings.onCreated(function() {
    GoogleMaps.ready('map', function(googleMap) {
        map = googleMap.instance;

        // Watch for changes to the Location collection.
        // Add rectangles to the map when new locations are added.
        // Remove rectangle from the map when a location is removed.
        Locations.find().observe({
            added: function(location) {
                // Show a rectangle on the map for this location
                var rectangle = new google.maps.Rectangle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    map: map,
                    bounds: new google.maps.LatLngBounds(
                        new google.maps.LatLng(location.southEast.latitude, location.northWest.longitude),
                        new google.maps.LatLng(location.northWest.latitude, location.southEast.longitude)
                    )
                });

                // Store this rectangle instance within the rectangle object.
                rectangles[location._id] = rectangle;
            },
            removed: function(location) {
                // Remove the rectangle from the map
                rectangles[location._id].setMap(null);

                // Clear the event listener
                google.maps.event.clearInstanceListeners(rectangles[location._id]);

                // Remove the reference to this rectangle instance
                delete rectangles[location._id];
            }
        });

        // Watch for changes done to the Device collection.
        // Add a new marker when a new device is added.
        // Move the marker when the device updates.
        // Remove the marker when device is removed.
        Devices.find().observe({
            added: function(device) {
                addDeviceMarker(device);
            },
            changed: function(device, oldDevice) {
                if(device.location) {
                    var marker = getDeviceMarker(device);

                    if(marker === undefined) {
                        addDeviceMarker(device);
                    }

                    marker.setPosition( { lng: device.location.longitude, lat: device.location.latitude });
                }
            },
            removed: function(device) {
                removeDeviceMarker(device);
            }
        });

    });
});

function addDeviceMarker(device) {
    if(!device.location)
        return;

    // Add a new marker on the map that shows the current device location
    var marker = new google.maps.Marker({
        position: { lng: device.location.longitude, lat: device.location.latitude },
        map: map,
        title: device.name
    });

    // Display device information when user clicks on the marker on the map
    google.maps.event.addListener(marker, 'click', function() {
        var body = $('body')[0];
        Blaze.renderWithData(Template.ViewDevice, { deviceId: device.id }, body);
    });

    // Add the marker to the collection
    markers[device._id] = marker;
}

function getDeviceMarker(device) {
    return markers[device._id];
}

function removeDeviceMarker(device) {
    // Remove the marker from the map
    markers[device._id].setMap(null);

    // Clear the event listener
    google.maps.event.clearInstanceListeners(markers[device._id]);

    // Remove the reference to this marker instance
    delete markers[device._id];
}

function scrollTo(selector, view){
    if(view === undefined)
        view = 'html,body';     // The default behavior is to scroll the HTML body

    $(view).animate({ scrollTop: $(selector).offset().top }, 'slow');
}

function getBoundsZoomLevel(bounds, mapDim) {
    var WORLD_DIM = { height: 256, width: 256 };
    var ZOOM_MAX = 21;

    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    var lngDiff = ne.lng() - sw.lng();
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
}