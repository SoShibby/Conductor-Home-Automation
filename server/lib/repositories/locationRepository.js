/**
 * Location repository is a wrapper library for adding and removing locations from the database.
 * Locations is in the form of rectangles that specify a specific area on the world map.
 */
LocationRepository = (function() {
    
    /**
	 * Adds a new location with a specific name. Use the site http://www.gps-coordinates.net/ 
     * for an easier way to get the coordinates of the location you want to add.
	 *
	 * @param userId              the id of the user who created this location entry
	 * @param locationName        the name of the location
     * @param northWestLongitude  the longitude coordinate of the top-left corner of the rectangle
     * @param northWestLatitude   the latitude coordinate of the top-left corner of the rectangle
     * @param southEastLongitude  the longitude coordinate of the bottom-right corner of the rectangle
     * @param southEastLatitude   the latitude coordinate of the bottom-right corner of the rectangle
     */
    function add(userId, locationName, northWestLongitude, northWestLatitude, southEastLongitude, southEastLatitude) {
        Assert.isString(userId, "Parameter user id must be a string");
        Assert.isNotEmptyString(userId, "Parameter user id must be a non empty string");
        Assert.isString(locationName, "Parameter location name must be a string");
        Assert.isNotEmptyString(locationName, "Parameter location name must be a non empty string");
        Assert.isFloat(northWestLongitude, "Parameter northWestLongitude must be a float value");
        Assert.isFloat(northWestLatitude, "Parameter northWestLatitude must be a float value");
        Assert.isFloat(southEastLongitude, "Parameter southEastLongitude must be a float value");
        Assert.isFloat(southEastLatitude, "Parameter southEastLatitude must be a float value");
        
        return Locations.insert({
                                    creator: userId,
                                    name: locationName,
                                    northWestLongitude: northWestLongitude,
                                    northWestLatitude: northWestLatitude,
                                    southEastLongitude: southEastLongitude,
                                    southEastLatitude: southEastLatitude
                                 });
    }
    
    /**
	 * Removes a location from the database
	 *
	 * @param _id  the id of the location that is to be removed
     */
    function remove(_id) {
        var result = Locations.remove(_id);
        
        if(result === 1)
            return true;
        else
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Unable to remove location, couldn't find a location with _id '" + _id + "'");
    }
    
    /**
	 * Get a location with a certain id
	 *
     * @param _id  the id of the location that is to be retrieved
     */
    function get(_id){
        return Locations.findOne(_id);
    }
    
    //return public functions
    return {
        add: add,
        remove: remove,
        get: get
    }
}());