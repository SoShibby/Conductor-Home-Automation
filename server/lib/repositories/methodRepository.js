/**
 * Handles the insertion and removing of device component methods
 */
MethodRepository = (function() {

    /**
	 * Adds a new method to a device component
	 *
	 * @param   controlUnitId     the id of the control unit that contains the device
	 * @param   deviceId          the id of the device that contains the component
	 * @param   componentId       the id of the component where the new method should be added to
	 * @param   methodName        the name of the method that we want to add
	 * @param   methodParameters  the parameters that the new method should have
	 */
	function add(controlUnitId, deviceId, componentId, methodName, methodParameters){
		Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
		Assert.isString(deviceId, "Parameter deviceId must be a string");
		Assert.isString(componentId, "Parameter componentId must be a string");
		Assert.isString(methodName, "Parameter methodName must be a string");
		
		if(!isValidParameters(methodParameters))
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Parameter methodParameters contains invalid methodParameters");
		
		var update = { $set: {} };
		update.$set['components.$.methods.' + methodName] = {
                                                                parameters: methodParameters
                                                            };
		var result = Devices.update({ 
                                        controlUnitId: controlUnitId,
                                        id: deviceId,
                                        'components.id': componentId
                                    },
                                    update,
                                    { 
                                        multi: false, 
                                        upsert: false 
                                    });
                                    
        if(result === 1)
            return true;
        else
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Failed to add method. No component found with id '" + componentId + "' in device with id '" + deviceId + "' in control unit with id '" + controlUnitId + "'");
	}
	
    /**
	 * Checks if method parameters are valid or not.
     * Valid method parameters should be in the form of:
     * {
     *      parameter1: "string",
     *      parameter2: "integer"
     * }
	 *
	 * @param   methodParameters  the method parameters that should be validated
     * @return                    true if the method parameters are valid, otherwise returns false
	 */
	function isValidParameters(methodParameters){
		if(typeof methodParameters !== "object")
			return false;
		
		var validDataTypes = [ "string", "integer", "double", "float", "enum" ];
		
		for (var parameterName in methodParameters) {
			var parameterType = methodParameters[parameterName];
			
			if(typeof parameterName !== "string")
				return false;
				
			if(!contains(validDataTypes, parameterType))
				return false;
		}
		
		return true;
	}
	
    /**
	 * Checks if an object exist in an array
	 *
	 * @param   array  the array that should be searched
     * @param   obj    the object that we are looking for
     * @return         true if the object exist in the array otherwise returns false
	 */
	function contains(array, obj) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] === obj) {
				return true;
			}
		}
		return false;
	}

    /**
	 * Removes all methods from a device component
	 *
	 * @param   controlUnitId     the id of the control unit that contains the device
	 * @param   deviceId          the id of the device that contains the component
	 * @param   componentId       the id of the component that contains the methods that we want to remove
	 */
	function removeAll(controlUnitId, deviceId, componentId){
		Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
		Assert.isString(deviceId, "Parameter deviceId must be a string");
		Assert.isString(componentId, "Parameter componentId must be a string");
		
		Devices.update({
								controlUnitId: controlUnitId,
								id: deviceId,
								'components.id': componentId
							},
							{
								$set: {
											'components.$.methods': {}
										}
							}); 
	}
	
    /**
	 * Removes a method from a device component
	 *
	 * @param   controlUnitId     the id of the control unit that contains the device
	 * @param   deviceId          the id of the device that contains the component
	 * @param   componentId       the id of the component that contains the method that we want to remove
	 * @param   methodName        the name of the method that we want to remove
	 */
	function remove(controlUnitId, deviceId, componentId, methodName){
		var where = {
						controlUnitId: controlUnitId,
						id: deviceId,
						'components.id': componentId
					};
                    
		where['components.methods.' + methodName] = { $exists: true };
		
		var update = { $unset: {} };
		update.$unset['components.$.methods.' + methodName] = 1;
		
		var result = Devices.update(where,
                                    update,
                                    { multi: false, upsert: false }); 
        
        if(result === 1)
            return true;
        else
           	throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Unable to remove method, couldn't find a method with the name '" + methodName + "' in component with id '" + componentId + "' and device with id '" + deviceId + "' and control unit with id '" + controlUnitId + "'"); 
	}
	
    /**
	 * Check if a method exist in a give device component
	 *
	 * @param   controlUnitId     the id of the control unit that contains the device
	 * @param   deviceId          the id of the device that contains the component
	 * @param   componentId       the id of the component that contains the method that we are looking for
	 * @param   methodName        the name of the method that we are looking for
     * @return                    true if the method exists otherwise returns false
     */
	function exists(controlUnitId, deviceId, componentId, methodName){
		var where = {
						controlUnitId: controlUnitId,
						id: deviceId,
						'components.id': componentId
					};
		where['components.methods.' + methodName] = { $exists: true };
		
		var device = Devices.findOne(where);

		return (device) ? true : false;
	}
	
	//Return public functions
	return {
		add: add,
		isValidParameters: isValidParameters,
		removeAll: removeAll,
		remove: remove,
		exists: exists
	}
}());

