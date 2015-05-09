/**
 * Handles the insertion and retrieving of devices from and to the database
 */
DeviceRepository = (function() {

    /**
	 * Creates and adds a new device to the database
	 *
	 * @param userId         the id of the user who "owns" this device
	 * @param controlUnitId  the id of the control unit that this device is associated with
     * @param deviceId       the id of the device
     * @param deviceName     a non empty name of the device
     * @param deviceType     a non empty string that describes the type of device
	 */
	function add(userId, controlUnitId, deviceId, deviceName, deviceType){
		Assert.isString(controlUnitId, "Parameter 'controlUnitId' must be a string");
		Assert.isString(deviceId, "Parameter 'deviceId' must be a string");
		Assert.isString(deviceName, "Parameter 'deviceName' must be a string");
		Assert.isString(deviceType, "Parameter 'deviceType' must be  a string");
		Assert.isNotEmptyString(controlUnitId, "Parameter 'controlUnitId' must contain one or more characters");
		Assert.isNotEmptyString(deviceId, "Parameter 'deviceId' must contain one or more characters");
		Assert.isNotEmptyString(deviceName, "Parameter 'deviceName' must contain one or more characters");
		Assert.isNotEmptyString(deviceType, "Parameter 'deviceType' must contain one or more characters");
		
		if(exists(controlUnitId, deviceId))
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "A device already exists with the deviceId '" + deviceId + "' in control unit with the controlUnitId '" + controlUnitId + "'");
		
		Devices.insert({  
							controlUnitId: controlUnitId,
							id: deviceId,
							name: deviceName,
							type: deviceType,
							components: [],
							userAccess: [ userId ]
						});
                        
		return deviceId;
	}
	
    /**
	 * Removes all devices that is associated with a certain control unit id
	 *
	 * @param controlUnitId  the id of the control unit that you want to remove all associated devices from
     */
	function removeAllByControlUnitId(controlUnitId){
		Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
		Assert.isNotEmptyString(controlUnitId, "Parameter 'controlUnitId' must contain one or more characters");
		
		Devices.remove({ 
                            controlUnitId: controlUnitId
                       });
	}
	
    /**
	 * Removes a single device by its id
	 *
	 * @param controlUnitId  the id of the control unit that this device is associated with
     * @param deviceId       the id of the device that you want to remove
	 */
	function remove(controlUnitId, deviceId){
		Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
		Assert.isString(deviceId, "Parameter deviceId must be a string");

		var result = Devices.remove({
                                        controlUnitId: controlUnitId,
                                        id: deviceId
                                    });
        
        if(result !== 0)    //If one or more record was successfully removed     then return true
            return true;
        else                //If no record was removed then throw error as this means no device was found
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Unable to remove device, no device exists with the id '" + deviceId + "' in control unit with id '" + controlUnitId + "'");
    }
	
    /**
	 * Get the name of a device
	 *
	 * @param controlUnitId  the id of the control unit that this device is associated with
     * @param deviceId       the id of the device that you want the name of
     * @return               the name of the device
	 */
	function getName(controlUnitId, deviceId){
		Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
		Assert.isString(deviceId, "Parameter deviceId must be a string");
		
		var device = Devices.findOne({ 
										controlUnitId: controlUnitId,
										id: deviceId
									 });
		
		if(!device)
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Couldn't find a device by the id '" + deviceId + "' in control unit with id '" + controlUnitId + "'");
			
		return device.name;
	}
	
    /**
	 * Get all the devices that is associated with a certain control unit
	 *
	 * @param controlUnitId  the id of the control unit that you want all the assocated devices from
     * @return               an array containing all associated devices or undefined if no devices exist
	 */
	function getDevicesByControlUnitId(controlUnitId){
		Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
		
		return Devices.find({ 
                                controlUnitId: controlUnitId,
                            }).fetch();
	}
	
    /**
	 * Check if a device with a certain id exist in a control unit
	 *
	 * @param controlUnitId  the id of the control unit that contains the device
     * @param deviceId       the id of the device that you want to check if it exist
     * @return               true if the device exists otherwise false
	 */
	function exists(controlUnitId, deviceId){
		Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
		Assert.isString(deviceId, "Parameter deviceId must be a string");
		
		var device = Devices.findOne({ 
										controlUnitId: controlUnitId,
										id: deviceId
									});
									
		return (device) ? true : false;
	}
	
    /**
	 * Set a new name for a device
	 *
	 * @param controlUnitId  the id of the control unit that contains the device
     * @param deviceId       the id of the device that you want to set a new name for
     * @param deviceName     the new name you want to set for the device 
	 */
	function setName(controlUnitId, deviceId, deviceName){
		Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
		Assert.isString(deviceId, "Parameter deviceId must be a string");
		Assert.isString(deviceName, "Parameter deviceName must be a string");
		
		var result = Devices.update({
                                        controlUnitId: controlUnitId,
                                        id: deviceId
                                    },
                                    {
                                        $set: {
                                                    name: deviceName
                                                } 
                                    });
        
        if(result === 1)  //If one record was successfully updated then return true
            return true;
		else            //If no records were updated then throw an error as this means that no device was found
        	throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "No device exist in control unit '" + controlUnitId + "' with device id '" + deviceId + "'");
	}
	
    /**
	 * Give a user access to a certain device
	 *
	 * @param userId         the id of the user of whom you want to give access to
	 * @param controlUnitId  the id of the control unit that contains the device
     * @param deviceId       the id of the device that you want to give access to
	 */
	function addUserAccess(userId, controlUnitId, deviceId){
		Assert.isString(userId, "Parameter userId must be a string");
		Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
		Assert.isString(deviceId, "Parameter deviceId must be a string");
		
        if(hasUserAccess(userId, controlUnitId, deviceId))
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "User with id '" + userId + "' already has access to device with id '" + deviceId + "'");    
        
		var result = Devices.update({
                                        controlUnitId: controlUnitId,
                                        id: deviceId
                                    },
                                    { 
                                        $push: { 
                                            userAccess: userId 
                                        } 
                                    });
                                    
        if(result === 1)    //If one record was successfully updated then return true
            return true;
        else                //If no record was updated then throw an error as this means no device was found
        	throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "No device exist in control unit '" + controlUnitId + "' with device id '" + deviceId + "'");    
	}
	
    /**
	 * Removes a users access to a device 
	 *
	 * @param userId         the id of the user of whom you want to remove access from
	 * @param controlUnitId  the id of the control unit that contains the device
     * @param deviceId       the id of the device that you want to remove access to
	 */
	function removeUserAccess(userId, controlUnitId, deviceId){
		Assert.isString(userId, "Parameter userId must be a string");
		Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
		Assert.isString(deviceId, "Parameter deviceId must be a string");
		
		if(!exists(controlUnitId, deviceId))
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "No device exist in control unit '" + controlUnitId + "' with device id '" + deviceId + "'");
		
		var result = Devices.update({
                                        controlUnitId: controlUnitId,
                                        id: deviceId
                                    },
                                    { 
                                        $pull: { 
                                            userAccess: userId 
                                        } 
                                    });
                                    
        if(result === 1)    //If one record was successfully updated then return true
            return true;
        else                //If no record was updated then throw an error as this means no device was found
        	throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "No device exist in control unit '" + controlUnitId + "' with device id '" + deviceId + "'");
	}
	
    /**
	 * Check if a user has access to a device
	 *
	 * @param userId         the id of the user
	 * @param controlUnitId  the id of the control unit that contains the device
     * @param deviceId       the id of the device that you want to check access for
     * @return               true if the user has access to the device otherwise return false
	 */
	function hasUserAccess(userId, controlUnitId, deviceId){
		Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
		Assert.isString(deviceId, "Parameter deviceId must be a string");
		Assert.isString(userId, "Parameter userId must be a string");
		
		if(!exists(controlUnitId, deviceId))
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "No device exist in control unit '" + controlUnitId + "' with device id '" + deviceId + "'");
		
		var device = Devices.findOne({
										controlUnitId: controlUnitId,
										id: deviceId,
										userAccess: { 
											$in: [ userId ] 
										}
									});
							
		return device !== undefined;
	}
    
    function setLocation(controlUnitId, deviceId, longitude, latitude) {
        var result = Devices.update({
                                        controlUnitId: controlUnitId,
                                        id: deviceId
                                   },
                                   {
                                        $set: {
                                                    'location.longitude': longitude,
                                                    'location.latitude': latitude
                                              }
                                   });
        
        if(result === 1)
            return true;
        else
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Unable to set device location.");
    }
	
    //Return public functions
	return {
		add: add,
		removeAllByControlUnitId: removeAllByControlUnitId,
		remove: remove,
		getName: getName,
		getDevicesByControlUnitId: getDevicesByControlUnitId,
		exists: exists,
		setName: setName,
		addUserAccess: addUserAccess,
		removeUserAccess: removeUserAccess,
		hasUserAccess: hasUserAccess,
        setLocation: setLocation
	};
	
}());