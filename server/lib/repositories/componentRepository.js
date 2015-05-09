/**
 * ComponentManager handles the insertion and retrieving of components 
 * from and to the database
 */
ComponentRepository = (function() {

    /**
     * Adds a new component to the given device
     *
     * @param  controlUnitId  the id of the control unit that contains the
     *                        device in which we will add the component
     * @param  deviceId       the id of the device in which we will add the
     *                        new component
     * @param  componentId    the id of the new component
     * @param  componentName  the name of the new component,
     *                        this can be any non empty string
     * @param  componentType  the type of the new component,
                              this can be any non empty string
     * @throw  Error          if the controlUnitId, deviceId, componentId, componentName,
     *                        componentType is an empty string.
     *                        an error will also be cast if the supplied controlUnitId and deviceId
     *                        is invalid or if the id of the new component already exist
     */
    function add(controlUnitId, deviceId, componentId, componentName, componentType){
        Assert.isString(controlUnitId, "Parameter 'controlUnitId' must be a string");
        Assert.isString(deviceId, "Parameter 'deviceId' must be a string");
        Assert.isString(componentId, "Parameter 'componentId' must be a string");
        Assert.isString(componentName, "Parameter 'componentName' must be a string");
        Assert.isString(componentType, "Parameter 'componentType' must be  a string");
        Assert.isNotEmptyString(controlUnitId, "Parameter 'controlUnitId' must contain one or more characters");
        Assert.isNotEmptyString(deviceId, "Parameter 'deviceId' must contain one or more characters");
        Assert.isNotEmptyString(componentId, "Parameter 'componentId' must contain one or more characters");
        Assert.isNotEmptyString(componentName, "Parameter 'componentName' must contain one or more characters");
        Assert.isNotEmptyString(componentType, "Parameter 'componentType' must contain one or more characters");
         
        if(this.exists(controlUnitId, deviceId, componentId))
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "A component already exists with the componentId '" + componentId + "' in device with id '" + deviceId + "' in control unit with the controlUnitId '" + controlUnitId + "'");
             
        var result = Devices.update({ 
                                        controlUnitId: controlUnitId,
                                        id: deviceId
                                    }, 
                                    { 
                                        $push: { 
                                                    components: {
                                                                id: componentId,
                                                                name: componentName,
                                                                type: componentType,
                                                                properties: {},
                                                                methods: {}
                                                            }
                                                }
                                    },
                                    { 
                                        upsert: true 
                                    });
                           
                                    
        if(result === 1)
            return true;
        else
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "No device exist with id '" + deviceId + "' in control unit with id '" + controlUnitId + "'");
    }

    /**
     * Get the name of a component of a certain id
     *
     * @param controlUnitId  the id of the control unit which contains the 
     *                       device which in turn contains the component
     * @param deviceId       the id of the device which contains the component
     * @param componentId    the id of the component we are looking for
     * @return               the name of the component
     * @throw Error          if no component is found with the given controlUnitId,
                             deviceId and componentId
     */
    function getName(controlUnitId, deviceId, componentId){
        var device = Devices.findOne({ 
                                        controlUnitId: controlUnitId,
                                        id: deviceId,
                                        'components.id': componentId
                                    },
                                    {
                                        fields: {   
                                                    'components': {
                                                                    $elemMatch: {
                                                                                    id: componentId
                                                                                }
                                                                }
                                                }
                                    });
        
        if (!device)
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Couldn't find a component with id '" + componentId + "' in device with deviceId '" + deviceId + "' in control unit with id '" + controlUnitId + "'");
            
        return device.components[0].name;
    }
    
    /**
     * Find a device component in a given device
     *
     * @param controlUnitId  the id of the control unit which contains the 
     *                       device which in turn contains the component
     * @param deviceId       the id of the device which contains the component
     * @param componentId    the id of the component we are looking for
     * @return               the device component object, if no device component is found then undefined is returned
     */
    function find(controlUnitId, deviceId, componentId){
        var device = Devices.findOne({ 
                                        controlUnitId: controlUnitId,
                                        id: deviceId,
                                        'components.id': componentId
                                    },
                                    {
                                        fields: {   
                                                    'components': {
                                                                    $elemMatch: {
                                                                                    id: componentId
                                                                                }
                                                                }
                                                }
                                    });
        
        return (device) ? device.components[0] : undefined;
    }
    
     /**
     * Find all device components of a given device
     *
     * @param controlUnitId  the id of the control unit which contains the 
     *                       device which in turn contains the components
     * @param deviceId       the id of the device which contains the components
     * @return               all device components in a device, if no device is found then undefined is returned
     */
    function findAll(controlUnitId, deviceId){
        var device = Devices.findOne({ 
                                         controlUnitId: controlUnitId,
                                         id: deviceId
                                     });
        
        return (device) ? device.components : undefined;
    }
    
    /**
     * Check if a component of a certain id exist in the database
     *
     * @param controlUnitId  the id of the control unit which contains the 
     *                       device which in turn contains the component
     * @param deviceId       the id of the device which contains the component
     * @param componentId    the id of the component we are looking for
     * @return               true if the component exist otherwise return false
     */
    function exists(controlUnitId, deviceId, componentId){
        var device = Devices.findOne({ 
                                        controlUnitId: controlUnitId,
                                        id: deviceId,
                                        'components.id': componentId 
                                    });
                                    
        return device !== undefined;
    }
    
    /**
     * Set a new name of a component
     *
     * @param controlUnitId  the id of the control unit which contains the 
     *                       device which in turn contains the component
     * @param deviceId       the id of the device which contains the component
     * @param componentId    the id of the component that we want to set the new name for
     * @throw Error          if no component is found with the given controlUnitId,
     *                       deviceId and componentId
     */
    function setName(controlUnitId, deviceId, componentId, componentName){
        var result = Devices.update({
                                        controlUnitId: controlUnitId,
                                        id: deviceId,
                                        'components.id': componentId
                                    },
                                    {
                                        $set: {
                                                    "components.$.name": componentName
                                              } 
                                    });
                                    
        if(result === 1)
            return true;
        else
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "No component exist in control unit '" + controlUnitId + "' with device id '" + deviceId + "' and componentId '" + componentName + "'");
    }
    
    // return public functions
    return {
        add: add,
        getName: getName,
        find: find,
        findAll: findAll,
        exists: exists,
        setName: setName
    }
}());