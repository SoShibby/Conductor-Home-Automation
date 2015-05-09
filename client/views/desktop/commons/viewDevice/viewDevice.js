var marker;
var map;

Template.ViewDevice.events({
    /* Close pop up window */
    'click .js-close': function(event, template) {
        Blaze.remove(template.view);
        $(template.firstNode).remove();
    },
    /* View component information */
    'click .js-info': function(event, template) {
        var body = $('body')[0];
        Blaze.renderWithData(Template.ViewComponent, { componentId: this.id }, body);
    },
    /* Change device location */
    'click .edit-device-location': function(event, template) {
        var body = $('body')[0];
        Blaze.renderWithData(Template.SetDeviceLocation, { deviceId: this.id }, body);
    }
});

Template.ViewDevice.helpers({  
    device: function(event, template) {
        return Devices.findOne({ id: this.deviceId });
    },
    mapOptions: function() {
        if (GoogleMaps.loaded()) {
            // If the device contains a location then move the map to devices location otherwise just set the map to a random position
            if(this.location)
                var center = new google.maps.LatLng(this.location.latitude, this.location.longitude)
            else
                var center = new google.maps.LatLng(59.377201047926526, 13.501424789428711);
                
            return {
                center: center,
                zoom: 15
            };
        }
    }
});

Template.ViewDevice.onCreated(function() {  
    var deviceId = this.data.deviceId;
    
    GoogleMaps.ready('viewDeviceMap', function(googleMap) {
        map = googleMap.instance;
        
        // Add a marker that points out the current device location
        marker = new google.maps.Marker({
            position: map.getCenter(),
            map: map,
            draggable: false
        });

        // Move the device location marker when the device updates
        Devices.find({ id: deviceId }).observe({              
            changed: function(newDocument, oldDocument) {
                var location = new google.maps.LatLng(newDocument.location.latitude, newDocument.location.longitude);
                marker.setPosition(location);
                map.setCenter(location);
            }
        });
    });
});