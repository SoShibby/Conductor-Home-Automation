Template.Lights.helpers({
	locationName: function() {
		return "Unknown Location".toUpperCase();
	},
	numberOfDevices: function() {
		return this.devices.length;
	},
	isLightOn: function() {
		return this.properties.power ? "active" : "";
	},
	sidebarInformation: function() {
		return {
					title: "Lighting Control",
					links: makeNavigationLinks()
			   };
	}
});

/**
 * makeNavigationLinks is used for creating links and link description for the side bar navigation
 *
 * @return  array containing link information that is shown in the side bar
 */
function makeNavigationLinks(){
	var links = [];
	var locations = Locations.find().fetch();
	
	for(var i = 0; i < locations.length; i++){
		var location = locations[i];
		
		var components = ComponentFinder.find({
												locationName: location.name,
												componentType: 'light',
												propertyName: 'power',
												propertyValue: true,
											 });
		
		var description = "";
		var highlightedDescription = "";
		
		if(components.length === 0) {
			description = "All lights are off";
			highlightedDescription = "";
		} else if(components.length === 1) {
			description = " light is on";
			highlightedDescription = "1";
		} else {
			description = " lights are on";
			highlightedDescription = components.length;
		}
		
		links.push({
						name: location.name,
						highlightedDescription: highlightedDescription,
						description: description,
						url: Router.current().route.url() + "?location=" + location.name,
						selected: false
				   });
	}
	
	return links;
}


