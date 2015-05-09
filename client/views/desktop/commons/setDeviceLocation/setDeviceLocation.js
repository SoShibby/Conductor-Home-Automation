var locations = {};
var map;
var marker;

Template.SetDeviceLocation.helpers({  
    device: function() {
        return Devices.findOne({ id: this.deviceId });
    },
    mapOptions: function() {
       if (GoogleMaps.loaded()) {
            // Center the map at the current device location, if no device location exist then center the map at a random coordinate
            if(this.location)
                var location = new google.maps.LatLng(this.location.latitude, this.location.longitude);
            else
                var location = new google.maps.LatLng(59.37903727051661, 13.49996566772461);
        
            return {
                center: location,
                zoom: 15
            };
        }
    }
});

Template.SetDeviceLocation.onCreated(function() {  
    GoogleMaps.ready('map', function(googleMap) {
        map = googleMap.instance;
        
        // Show a marker on the map where the new device location will be set
        marker = new google.maps.Marker({
            position: map.getCenter(),
            map: map,
            draggable:true
        });
        
        // Move the marker to the mouse position when the user clicks on the map
        google.maps.event.addListener(map, 'click', function(event) {
            marker.setPosition(event.latLng);
        });
    });
});

Template.SetDeviceLocation.events({
    /* Save new device location */
    'click .js-save': function(event, template) {
        var latitude = marker.getPosition().lat();
        var longitude = marker.getPosition().lng();
        
        Meteor.call('setDeviceLocation', this.controlUnitId, this.id, longitude, latitude, function(error, result){
			if(error){
				MessageBox.displayInfo("Failed to set new device location", "An error occurred when setting a new device location. The error message was: " + error);
			}else{
				Blaze.remove(template.view);
				$(template.firstNode).remove();
			}
		});
    },
    /* Close popup window */
    'click .js-close': function(event, template) {
		Blaze.remove(template.view);
		$(template.firstNode).remove();
    }
});