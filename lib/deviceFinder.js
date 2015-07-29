DeviceFinder = (function() {

    /**
     * Finds available devices 
     *
     * @param filter  optional parameter used for filtering out unwanted devices, if no filter is used then all devices will be returned
     * @return        array of devices that matches the filter used
     */
    function find(filter) {
        //If no filter is specified, then set the filter to an empty filter.
        if(!filter) {
            filter = {};
        }
        
        //If the filter is a json array then loop through the array and concat all devices that matches the individual filters.
        if(filter instanceof Array) {
            var devices = [];
            
            for(var i = 0;i < filter.length; i++){
                var matchingDevices = getDevices(filter[i]);
                devices.concat(matchingDevices);
            }
            
            return devices;
        }else{                          //If the filter is a single json object then get all devices that matches that one filter
            return getDevices(filter);
        }
    }
    
    /**
     * Get all devices that matches the given filter
     *
     * @param filter  the filter used to filter out unwanted devices
     * @return        array of devices that matches the filter
     */
    function getDevices(filter) {
        if(filter.controlUnitName || filter.owner || filter.apiKey) {
            var controlUnits = getMatchingControlUnits(filter);
            var uniqueControlUnitIds = getUniqueControlUnitIds(controlUnits);
            filter.controlUnitIds = uniqueControlUnitIds;
        }
        
        var devices = filterDevices(filter);

        if(filter.locationName) {
            devices = filterByLocation(devices, filter);
        }
        
        if(filter.componentId || filter.componentType || filter.componentName) {
            devices = filterComponents(devices, filter);
        }
        
        return devices;
    }
    
    /**
     * Get control units that matches the given filter
     *
     * @param filter  the filter used to filter out unwanted control units
     * @return        array of control units that matches the filter
     */
    function getMatchingControlUnits(filter) {
        var selector = {};
        
        if(filter.controlUnitId)
            selector.controlUnitId = filter.controlUnitId;
        if(filter.controlUnitName)
            selector.name = filter.controlUnitName;
        if(filter.owner)
            selector.owner = filter.owner;
        if(filter.apiKey)
            selector.apiKey = filter.apiKey;
        
        return ControlUnits.find(selector).fetch();
    }
    
    /**
     * Returns an array containing only the unique control unit ids
     *
     * @param controlUnits  array of control units that we should get the control unit ids from
     * @return              array of control unit ids
     */
    function getUniqueControlUnitIds(controlUnits){
        var uniqueControlUnitIds = new Array();
        
        for(var i = 0; i < controlUnits.length; i++){
            var controlUnitId = controlUnits[i].controlUnitId;
            
            if(uniqueControlUnitIds.indexOf(controlUnitId) === -1)
               uniqueControlUnitIds.push(controlUnitId); 
        }
        
        return uniqueControlUnitIds;
    }
    
    /**
     * Fetches all devices from the Device collection that matches the filter
     *
     * @param filter  filters out unwanted devices
     * @return        array of devices that matches the filter
     */
    function filterDevices(filter) {
        var selector = {};
        
        //Control Units
        if(filter.controlUnitIds){
            selector.controlUnitId = { $in: filter.controlUnitIds};
        }
        
        //Devices
        if(filter.deviceId)
            selector.id = filter.deviceId;
        if(filter.deviceName)
            selector.name = filter.deviceName;
        if(filter.deviceType)
            selector.type = filter.deviceType;
		if(filter.userAccess)
			selector['userAccess'] = { $in: [ filter.userAccess ] };
            
        //Components
        if(filter.componentId || filter.componentType || filter.componentName) {
            selector['components'] = {};
            selector['components']['$elemMatch'] = {};
        }

        if(filter.componentId)
            selector['components']['$elemMatch']['id'] = filter.componentId;
            //selector['components.id'] = filter.componentId;
        if(filter.componentType)
            selector['components']['$elemMatch']['type'] = filter.componentType;
            //selector['components.type'] = filter.componentType;
        if(filter.componentName)
            selector['components']['$elemMatch']['name'] = filter.componentName;
            
        //Property
        if(filter.propertyName) {
            if(selector['components'] === undefined){
                selector['components'] = {};
                selector['components']['$elemMatch'] = {};
            }

            selector['components']['$elemMatch']['properties.' + filter.propertyName] = { $exists: true };
            
            if(filter.propertyValue !== undefined) {
                selector['components']['$elemMatch']['properties.' + filter.propertyName + ".value"] = filter.propertyValue;
            }
        }
        //Method
        if(filter.methodName)
            selector['components.methods.' + filter.methodName] = { $exists: true };
        
        return Devices.find(selector).fetch();      //Search the database for matching devices and return the result
    }
    
    /**
     * Filters out unwanted components from the device
     *
     * @param filter  filter that is used to remove unwanted components
     * @return        array of devices that matches the filter
     */
    function filterComponents(devices, filter) {
        return _.map(devices, function(device) {
            device.components =  _.filter(device.components, function(component) {
                if(filter.componentId && filter.componentId !== component.id){
                    return false;
                }

                if(filter.componentType && filter.componentType !== component.type) {
                    return false;
                }

                if(filter.componentName && filter.componentName !== component.name){
                    return false;
                }

                return true;
            });

            return device;
        });
    }
    
    /**
     * Filters devices based on the location of the device
     *
     * @param filter  filter that is used to remove devices that is not in the specified location
     * @return        array of devices that is in the specified location
     */
    function filterByLocation(devices, filter) {    
        var location = Locations.findOne({
                                            name: filter.locationName
                                         });
        
        //If no location exist with the name we are looking for then return an empty array, 
        //as no devices exist in the location with the specified name. 
        if(!location)
            return [];
        
        for(var i = devices.length - 1; i >= 0; i--){
            var device = devices[i];
            
            //If the device doesn't contain any location information then remove this device
            if(!device.location) {
                devices.splice(i, 1);
                continue;
            }
            
            //If the device isn't inside the bounderies of the location we are looking for then remove this device
            if(device.location.longitude < location.x1 || device.location.longitude > location.x2 ||
               device.location.latitude  > location.y1 || device.location.latitiude > location.y2) {
                
                devices.splice(i, 1);
            }
            
        }
        
        return devices;
    }
    
    //Return public functions
    return {
        find: find
    }
}());