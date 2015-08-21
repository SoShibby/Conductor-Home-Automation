Meteor.methods({
    addControlUnit: function(name){
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);

        Assert.isString(name, "The control unit name must be a string.");
        Assert.isNotEmptyString(name, "The control unit name cannot be empty.");

        ControlUnitRepository.add(this.userId, name);
    },
    addDevice: function(apiKey, deviceId, deviceName, deviceType, components){
        try{
            console.log('\n------- addDevice DDP --------');

            //Print debug messages
            console.log("API key: " + apiKey);
            console.log("device id: " + deviceId);
            console.log("device name: " + deviceName);
            console.log("device type: " + deviceType);

            //Check if the api key is set in the http parameter
            Assert.isString(apiKey, "Invalid api key, the api key must be a string.");
            Assert.isString(deviceId, "Invalid parameter deviceId, the deviceId must be a string.");
            Assert.isNotEmptyString(deviceId, "The parameter deviceId cannot be an empty string.");
            Assert.isString(deviceName, "Invalid parameter device name, the device name must be a string.");
            Assert.isNotEmptyString(deviceName, "The parameter deviceName cannot be an empty string.");
            Assert.isString(deviceType, "Invalid parameter device type, the device type must be a string.");
            Assert.isNotEmptyString(deviceType, "The parameter deviceType cannot be an empty string.");
            Assert.isObject(components, "Invalid parameter components, components must be an object.");

            //Check if the api key is valid
            if(!Authentication.authenticate(apiKey, Authentication.AccessLevel.CONTROL_UNIT)){
                throw new Meteor.Error(ErrorCode.INVALID_API_KEY, "Invalid API key.");
            }

            var controlUnitId = ControlUnitRepository.getControlUnitIdByApiKey(apiKey);

            //Check if a device with the same deviceId already exists
            if(DeviceRepository.exists(controlUnitId, deviceId)){
                console.log("Device already exist.");
                throw new Meteor.Error(ErrorCode.DEVICE_ALREADY_EXIST, "A device with the deviceId: '" + deviceId + "' already exists");
            }

            //Verify that components contains valid data
            components.forEach(function(component) {
                //Print debug messages
                console.log("-- Verifying component --");
                console.log("component id: " + component.id);
                console.log("component name: " + component.name);
                console.log("component type: " + component.type);

                Assert.isString(component.id, "Invalid component id. Only string values are valid component ids.")
                Assert.isNotEmptyString(component.id, "Invalid component id. The component id cannot be an empty string.");
                Assert.isString(component.name, "Invalid component name. Only string values are valid component names.")
                Assert.isNotEmptyString(component.name, "Invalid component name. The component name cannot be an empty string.");
                Assert.isString(component.type, "Invalid component type. Only string values are valid component types.")
                Assert.isNotEmptyString(component.type, "Invalid component type. The component type cannot be an empty string.");

                if(ComponentRepository.exists(controlUnitId, deviceId, component.id))
                    throw new Meteor.Error(ErrorCode.COMPONENT_ALREADY_EXIST, "Invalid component, a component already exists with the component id '" + componentId + " in device with id ' " + deviceId + "' and control unit with id '" + controlUnitId + "'.");

                Assert.isObject(component.properties, "Properties fields is not an object, in component with component name '" + component.name + "'.");
                Assert.isObject(component.methods, "Methods fields is not an object, in component with component name '" + component.name + "'.");

                //Verify that the properties of this component contains valid data
                component.properties.forEach(function(property) {
                    //Print debug messages
                    console.log("-- Verifying property --");
                    console.log("property name: " + property.name);
                    console.log("property value: " + property.value);
                    console.log("property type: " + property.type);
                    console.log("property enum: " + property.enum);

                    Assert.isString(property.name, "Invalid name. Only string values are valid property names.");
                    Assert.isNotEmptyString(property.name, "Invalid property name. The property name cannot be an empty string.");
                    Assert.isDefined(property.value, "property.value was not set in the property with the name'" + property.name + "' in component with the name '" + component.name + "'.");
                    Assert.isDefined(property.type, "property.type was not set in the property with the name'" + property.name + "' in component with the name '" + component.name + "'.");

                    //If property.enum is not set then just set it to null. On some clients the property.enum is not included when the value is null.
                    if(property.enum === undefined)
                        property.enum = null;

                    if(property.enum !== null && !PropertyRepository.isValidEnum(property.enum)){
                        throw new Meteor.Error(ErrorCode.INVALID_DATA_SUPPLIED, "Invalid property.enum in the property with name'" + property.name + "'.");
                    }

                    if(!PropertyRepository.isValidValue(property.value, property.type, property.enum)){
                        throw new Meteor.Error(ErrorCode.INVALID_DATA_SUPPLIED, "property.value and property.type (and maybe property.enum) does not match in the property with name'" + property.name + "'.");
                    }
                });

                //Verify that the methods of this component contains valid data
                component.methods.forEach(function(method) {
                    //Print debug messages
                    console.log("-- Verifying method --");
                    console.log("method name: " + method.name);
                    console.log("method parameters: " + method.parameters);

                    Assert.isString(method.name, "Invalid name. Only string values are valid property names.");
                    Assert.isNotEmptyString(method.name, "Invalid method name. The method name cannot be an empty string.");

                    if(!MethodRepository.isValidParameters(method.parameters))
                        throw new Meteor.Error(ErrorCode.INVALID_DATA_SUPPLIED, "method.parameters contains invalid data.");
                });
            });

            var owner = ControlUnitRepository.getOwner(controlUnitId);

            //Add the device to the database
            DeviceRepository.add(owner, controlUnitId, deviceId, deviceName, deviceType);

            //Add all the components to the database
            components.forEach(function(component) {
                ComponentRepository.add(controlUnitId, deviceId, component.id, component.name, component.type);

                //Add all the properties of this component to the database
                component.properties.forEach(function(property) {
                    PropertyRepository.add(controlUnitId, deviceId, component.id, property.name, property.value, property.type, property.enum);
                });

                //Add all the methods of this component to the database
                component.methods.forEach(function(method) {
                    MethodRepository.add(controlUnitId, deviceId, component.id, method.name, method.parameters);
                });
            });

            console.log("Device added successfully.");
        } catch(e) {
            console.log(e);
            throw e;
        }
    },
    removeControlUnit: function(controlUnitId){
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);

        if(ControlUnitRepository.isOwner(this.userId, controlUnitId)){
            DeviceRepository.removeAllByControlUnitId(controlUnitId);
            ControlUnitRepository.remove(controlUnitId);
        }else{
            throw new Meteor.Error(500, "Only the owner of this control unit can remove this control unit.");
        }
    },
    removeDevice: function(apiKey, deviceId){
        console.log('\n------- removeDevice DDP --------');

        Assert.isString(apiKey, "Invalid api key, the api key must be a string.")
        Assert.isString(deviceId, "Invalid parameter deviceId, the deviceId must be a string.")

        //Check if the api key is valid
        if(!Authentication.authenticate(apiKey, Authentication.AccessLevel.CONTROL_UNIT)){
            throw new Meteor.Error(ErrorCode.INVALID_API_KEY, "Invalid apiKey.");
        }

        var controlUnitId = ControlUnitRepository.getControlUnitIdByApiKey(apiKey);

        DeviceRepository.removeById(controlUnitId, deviceId);
    },
    removeDevices: function(apiKey){
        console.log('\n------- removeDevices DDP --------');

        Assert.isString(apiKey, "Invalid api key, the api key must be a string.")

        //Check if the api key is valid
        if(!Authentication.authenticate(apiKey, Authentication.AccessLevel.CONTROL_UNIT)){
            throw new Meteor.Error(ErrorCode.INVALID_API_KEY, "Invalid apiKey.");
        }

        var controlUnitId = ControlUnitRepository.getControlUnitIdByApiKey(apiKey);

        DeviceRepository.removeAllByControlUnitId(controlUnitId);
    },
    setPropertyValue: function(apiKey, deviceId, componentId, propertyName, propertyValue){
        console.log('\n------- setPropertyValue DDP --------');
        console.log(String.format('apiKey: {apiKey} \ndeviceId: {deviceId} \ncomponentId: {componentId} \npropertyName: {propertyName} \npropertyValue: {propertyValue} \n', { apiKey: apiKey, deviceId: deviceId, componentId: componentId, propertyName: propertyName, propertyValue: propertyValue }));

        Assert.isString(apiKey, "Invalid api key, the api key must be a string.");
        Assert.isString(deviceId, "Invalid parameter deviceId, the deviceId must be a string.");
        Assert.isString(componentId, "Invalid parameter componentId, the componentId must be a string.");
        Assert.isString(propertyName, "Invalid parameter propertyName. Only string values are valid property names.");
        Assert.isDefined(propertyValue, "Invalid parameter propertyValue, the property value is not defined.");

        //Check if the api key is valid
        if(!Authentication.authenticate(apiKey, Authentication.AccessLevel.CONTROL_UNIT)){
            throw new Meteor.Error(ErrorCode.INVALID_API_KEY, "Invalid apiKey.");
        }

        var controlUnitId = ControlUnitRepository.getControlUnitIdByApiKey(apiKey);

        //Set the property value in the database
        PropertyRepository.setValue(controlUnitId, deviceId, componentId, propertyName, propertyValue);

        TriggerObserver.check();

        //Send OK response
        return true;
    },
    heartbeat: function(apiKey){
        var controlUnitId = ControlUnitRepository.getControlUnitIdByApiKey(apiKey);
        HeartbeatManager.heartbeat(controlUnitId);
    }
});