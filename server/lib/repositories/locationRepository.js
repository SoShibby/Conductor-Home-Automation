/**
 * Location repository is a wrapper library for adding and removing locations from the database.
 * Locations is in the form of rectangles that specify a specific area on the world map.
 */
LocationRepository = (function() {
    
    /**
	 * Adds a new location with a specific name. Use the site http://www.gps-coordinates.net/ 
     * for an easier way to get the coordinates of the location you want to add.
	 *
	 * @param userId        the id of the user who created this location entry
	 * @param locationName  the name of the location
     * @param x1            the longitude coordinate of the top-left corner of the rectangle
     * @param y1            the latitude coordinate of the top-left corner of the rectangle
     * @param x2            the longitude coordinate of the bottom-right corner of the rectangle
     * @param y2            the latitude coordinate of the bottom-right corner of the rectangle
     */
    function add(userId, locationName, x1, y1, x2, y2) {
        Assert.isString(userId, "Parameter user id must be a string");
        Assert.isNotEmptyString(userId, "Parameter user id must be a non empty string");
        Assert.isString(locationName, "Parameter location name must be a string");
        Assert.isNotEmptyString(locationName, "Parameter location name must be a non empty string");
        Assert.isFloat(x1, "Parameter x1 must be a float value");
        Assert.isFloat(x2, "Parameter x2 must be a float value");
        Assert.isFloat(y1, "Parameter y1 must be a float value");
        Assert.isFloat(y1, "Parameter y2 must be a float value");
        
        return Locations.insert({
                                    creator: userId,
                                    name: locationName,
                                    x1: x1,
                                    x2: x2,
                                    y1: y1,
                                    y2: y2
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