Meteor.methods({
    addLocation: function(locationName, x1, y1, x2, y2){
		if(!User.isUserLoggedIn(this.userId))
			throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
			
		Assert.isString(locationName, "The location name must be a string.");
		Assert.isNotEmptyString(locationName, "The location name cannot be empty.");
        Assert.isFloat(x1, "Parameter x1 must be a float value");
        Assert.isFloat(x2, "Parameter x2 must be a float value");
        Assert.isFloat(y1, "Parameter y1 must be a float value");
        Assert.isFloat(y1, "Parameter y2 must be a float value");
		
		LocationRepository.add(this.userId, locationName, x1, y1, x2, y2);
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