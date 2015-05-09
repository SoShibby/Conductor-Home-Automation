var locations = {};
var map;
var rectangle;

Template.AddLocation.helpers({  
    mapOptions: function() {
        if (GoogleMaps.loaded()) {
            // Center the map at a random coordinate
            return {
                center: new google.maps.LatLng(59.37903727051661, 13.49996566772461),
                zoom: 8
            };
        }
    }
});

Template.AddLocation.onCreated(function() {  
    GoogleMaps.ready('map', function(googleMap) {
        map = googleMap.instance;
        
        var bounds = getBoundsByPercentage(map, 0.8);   // Get a rectangle that takes up 80% of the current map view
        
        // Show a rectangle on the map that defines the new location area
        rectangle = new google.maps.Rectangle({
            bounds: bounds,
            editable: true,
            draggable: true,
            map: map
        });

    });
});

Template.AddLocation.events({
    /* Add new location area */
    'click .js-add': function(event, template) {
        var ne = rectangle.getBounds().getNorthEast();  // Get North-East coordinate of the rectangle
        var sw = rectangle.getBounds().getSouthWest();  // Get the South-West coordinate of the rectangle
        
        var locationName = template.$('.js-location-name').val();
        
        Meteor.call('addLocation', locationName, sw.lng(), ne.lat(), ne.lng(), sw.lat(), function(error, result){
			if(error){
				MessageBox.displayInfo("Failed to add a new location", "An error occurred when adding a new location. The error message was: " + error);
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
    },
    /* Show/Hide location area on the map */
    'click .toggle-location-visibility': function(event, template) {
        var visible = !rectangle.getVisible();
        rectangle.setVisible(visible);
        
        rectangle.setBounds(getBoundsByPercentage(map, 0.8));   // Get a rectangle that takes up 80% of the current map view
        
        if(visible)
            template.$('.toggle-location-visibility').text('Hide location');
        else
            template.$('.toggle-location-visibility').text('Show location');
    }
});

function getBoundsByPercentage(map, percentage) {
    var latNE = map.getBounds().getNorthEast().lat();
    var lngNE = map.getBounds().getNorthEast().lng();
    var latSE = map.getBounds().getSouthWest().lat();
    var lngSE = map.getBounds().getSouthWest().lng();
    
    var latDiff = latNE - latSE;
    var lngDiff = lngNE - lngSE;
    
    var bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(latSE + latDiff * (1 - percentage), lngSE + lngDiff * (1 - percentage)),
        new google.maps.LatLng(latSE + latDiff * percentage, lngSE + lngDiff * percentage)
    );
    
    return bounds;
}