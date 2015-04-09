/**
 * Handles the insertion and retrieving of device component properties
 */
PropertyRepository = (function() {

    /**
	 * Adds a new property to a device component
	 *
	 * @param   controlUnitId  the id of the control unit that contains the device
	 * @param   deviceId       the id of the device that contains the component
	 * @param   componentId    the id of the component that contains the property
	 * @param   propertyName   the name of the property that we want to add
	 * @param   propertyValue  the value of the new property 
	 * @param   dataType       the data type of the new property. Valid values are string, integer, double, enum
	 * @param   enums          array containing string values, where the values represent the only valid values that this property can take. 
                               This parameter should only be set if the data type of the property is set to "enum".
	 */
	function add(controlUnitId, deviceId, componentId, propertyName, propertyValue, dataType, enums){
		Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
		Assert.isString(deviceId, "Parameter deviceId must be a string");
		Assert.isString(componentId, "Parameter componentId must be a string");
		Assert.isString(propertyName, "Parameter propertyName must be a string");
		
		if(enums !== undefined && !isValidEnum(enums))
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Invalid property enum.");
		
		if(!isValidValue(propertyValue, dataType, enums))
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Invalid property value. The value doesn't correspond to the dataType and/or the dataType is not a valid data type");
		
		var update = { $set: {} };
		update.$set['components.$.properties.' + propertyName] = {
                                                                    value: propertyValue,
                                                                    type: dataType,
                                                                    'enum': enums,
                                                                    updated: new Date
                                                                }
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
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Failed to add property. No component found with id '" + componentId + "' in device with id '" + deviceId + "' in control unit with id '" + controlUnitId + "'");
	}
	
    /**
	 * Check if a enum is a valid enum or not
	 *
	 * @param   enums  the enum that should be validated
	 * @return         true if the enum is a valid enum, otherwise returns false
	 */
	function isValidEnum(enums){
		if(Object.prototype.toString.call(enums) !== '[object Array]')
			return false;
			
		for(var i = 0;i < enums.length;i++){
			//Check if the index i exists as an array key, we want the enum to use array keys from 0 to array length. (so we don't get an array that uses array["somekey"])
			if(!(i in enums))
				return false;
			//Check that the enum value is a string
			if(typeof enums[i] !== "string")
				return false;
		}
		
		return true;
	}
	
    /**
	 * Check if a value is of the correct data type and/or exist in the enum parameter
	 *
	 * @param   value     the value that should be validated
	 * @param   dataType  the data type that the value should have
	 * @param   enums     array containing string values, where the values represent the only valid values that this property can take. 
                          This parameter should only be set if the data type of the property is set to "enum".
	 * @return            true if the value is valid, otherwise returns false
	 */
	function isValidValue(value, dataType, enums){
		//Checks if value and data type is a string or boolean
		if(typeof value === dataType)
			return true;

		if(typeof value === "number"){
			//Check if value and data type is integer
			if(value % 1 === 0 && dataType === "integer")
				return true;
				
			//Check if value and data type is double
			if(value % 1 !== 0 && dataType === "double")
				return true;
		}
		
		//Check if data type is an enumm and if the value exists in the enum
		if(dataType === "enum"){
			if(enums.indexOf(value) > -1)
				return true;
		}
			
		return false;
	}
	
    /**
	 * Removes all properties from a device component
	 *
	 * @param   controlUnitId  the id of the control unit that contains the device
	 * @param   deviceId       the id of the device that contains the component
	 * @param   componentId    the id of the component that the properties should be removed from
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
                                        'components.$.properties': {}
                                    }
                        }); 
	}
	
    /**
	 * Removes a property from a device component
	 *
	 * @param   controlUnitId  the id of the control unit that contains the device
	 * @param   deviceId       the id of the device that contains the component
	 * @param   componentId    the id of the component that contains the property
	 * @param   propertyName    the name of the property that is to be removed
	 */
	function remove(controlUnitId, deviceId, componentId, propertyName){
		var where = {
						controlUnitId: controlUnitId,
						id: deviceId,
						'components.id': componentId
					};
                    
		where['components.properties.' + propertyName] = { $exists: true };
		
		var update = { $unset: {} };
		update.$unset['components.$.properties.' + propertyName] = 1;
		
		var result = Devices.update(where,
                                    update,
                                    { multi: false, upsert: false }); 
		
        if(result === 1)
            return true;
        else
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Unable to remove property, couldn't find a property with the name '" + propertyName + "' in component with id '" + componentId + "' and device with id '" + deviceId + "' and control unit with id '" + controlUnitId + "'");
	}

    /**
	 * Get a property object from a device component
	 *
	 * @param   controlUnitId  the id of the control unit that contains the device
	 * @param   deviceId       the id of the device that contains the component
	 * @param   componentId    the id of the component that contains the property
	 * @param   propertyName    the name of the property that is to be returned
	 * @return                 a property object if found else returns undefined    
	 */
    function find(controlUnitId, deviceId, componentId, propertyName){
        var device = Devices.findOne({
                                        controlUnitId: controlUnitId,
                                        id: deviceId,
                                        'components.id': componentId
                                     });
        
        if(!device)
            return undefined;
            
        for(var i = 0; i < device.components.length; i++){
            var component = device.components[i];
            
            if(component.id === componentId)
                return component.properties[propertyName];
        }
        
        return undefined;
    }
 
    /**
	 * Sets the value of a given property
	 *
	 * @param   controlUnitId  the id of the control unit that contains the device
	 * @param   deviceId       the id of the device that contains the component
	 * @param   componentId    the id of the component that contains the property
	 * @param   propertyName   the name of the property we want to change the value of
	 * @param   propertyValue   the new value that the property should have
	 */ 
	function setValue(controlUnitId, deviceId, componentId, propertyName, propertyValue){
		var property = find(controlUnitId, deviceId, componentId, propertyName);
        
        if(!property)
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Unable to set property value, couldn't find a property with the name '" + propertyName + "' in component with id '" + componentId + "' and in device with id '" + deviceId + "' and control unit with id '" + controlUnitId + "'");
        
        if(!isValidValue(propertyValue, property.type, property.enum))
			throw new Error("Invalid property value. The property value isn't of the right data type and/or doesn't exist in the property enum.");
		
		//Set the new value for the property
		var update = { $set: {} };
		update.$set['components.$.properties.' + propertyName + '.value'] = propertyValue;
		update.$set['components.$.properties.' + propertyName + '.updated'] = new Date;
		
        Devices.update({
                            controlUnitId: controlUnitId,
                            id: deviceId,
                            'components.id': componentId
                            
                       }, update);
	}
	
    /**
	 * Check if a device component has a property with a certain name
	 *
	 * @param   controlUnitId  the id of the control unit that contains the device
	 * @param   deviceId       the id of the device that contains the component
	 * @param   componentId    the id of the component that contains the property
	 * @param   propertyName   the name of the property that we want to check if it exist
	 * @return                 true if the property exist otherwise returns false  
	 */ 
	function exists(controlUnitId, deviceId, componentId, propertyName){
		var where = {
						controlUnitId: controlUnitId,
						id: deviceId,
						'components.id': componentId
					};
		where['components.properties.' + propertyName] = { $exists: true };
		
		return Devices.find(where).count() > 0;
	}
	
	//Return public functions
	return {
		add: add,
		isValidEnum: isValidEnum,
		isValidValue: isValidValue,
		removeAll: removeAll,
		remove: remove,
        find: find,
		setValue: setValue,
		exists: exists
	}
}());