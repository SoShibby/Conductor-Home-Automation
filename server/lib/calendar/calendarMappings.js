CalendarMapping = (function() {
	function add(userId, name, value, timeOffset) {
		Assert.isString(userId, "Parameter userId must be a string");
		Assert.isString(name, "Parameter name must be a string");
		Assert.isInt(timeOffset, "Parameter timeOffset must be an integer");
		
		CalendarMappings.insert({
									name: name,
									value: value,
									timeOffset: timeOffset,
									owner: userId
								});
	}
    
	function remove(_id){
		CalendarMappings.remove({ _id: _id });
	}
    
	function isOwner(userId, _id){
		var mapping = CalendarMappings.findOne({
													_id: _id,
													owner: userId
												});
		return mapping !== undefined;
    }
    
    // Return public function
    return {
        add: add,
        remove: remove,
        isOwner: isOwner
    }
}());