Template.Lights.helpers({
    locationName: function() {
        return this.locationName.toUpperCase();
    },
    numberOfDevices: function() {
        return this.devices.length;
    },
    isLightOn: function() {
        return this.properties.power ? "active" : "";
    },
    sidebarInformation: function() {
        //If no location is selected in the sidebar, then go to the first link in the navigation sidebar
        if(this.locationName === undefined){
            var links = makeNavigationLinks();
            
            if(links.length !== 0){
                Router.go('lights', {}, { query: { locationName: links[0].name }});     //Navigate to the first link in the sidebar
            }else{
                //No links exist in the sidebar
            }
        }
        
        return {
                    title: "Lighting Control",
                    links: makeNavigationLinks(this.locationName)
               };
    }
});

/**
 * makeNavigationLinks is used for creating links and link description for the side bar navigation
 *
 * @return  array containing link information that is shown in the side bar
 */
function makeNavigationLinks(currentLocation){
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
                        url: Router.current().route.url() + "?locationName=" + location.name,
                        selected: (currentLocation === location.name)       //If the location that this link points to is the same location that we are currently viewing then set this link as selected 
                   });
    }
    
    return links;
}


