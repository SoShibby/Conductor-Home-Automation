Meteor.methods({
    addLocation: function(locationName, northWestLongitude, northWestLatitude, southEastLongitude, southEastLatitude){
		if(!User.isUserLoggedIn(this.userId))
			throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
			
		Assert.isString(locationName, "The location name must be a string.");
		Assert.isNotEmptyString(locationName, "The location name cannot be empty.");
        Assert.isFloat(northWestLongitude, "Parameter northWestLongitude must be a float value");
        Assert.isFloat(northWestLatitude, "Parameter northWestLatitude must be a float value");
        Assert.isFloat(southEastLongitude, "Parameter southEastLongitude must be a float value");
        Assert.isFloat(southEastLatitude, "Parameter southEastLatitude must be a float value");
		
		LocationRepository.add(this.userId, locationName, northWestLongitude, northWestLatitude, southEastLongitude, southEastLatitude);
	},
    removeLocation: function(locationId){
        if(!User.isUserLoggedIn(this.userId))
			throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
		
        var location = LocationRepository.get(locationId);
        
        if(!location)
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Couldn't find a location with id '" + _id + "'");
            
        if(location.creator !== this.userId)
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED, "Only the creator of the location can remove it.");
        
        LocationRepository.remove(locationId);
    }
});