/**
 * The controller class is used for sending commands to control units which in turn will send the command to the 
 * correct device and device component.
 */
Controller = (function() {
    
    /**
     * Send commands to control units
     *
     * @param data  the data that is to be sent to the control unit(s), the data must contain at a minimum
     *              propertyName and setPropertyValue or methodName and methodParameters. Filters can also
     *              be used so only wanted devices will receive the commands. Example of filters are:
     *              deviceName, deviceType, componentName, componentType etc.
     */
	function send(data){
		//Get and filter control units, devices, components that are matching the filters in the data parameter.
        //Then create commands that is to be sent to each matching control unit.
		var allCommands = [];
		
		if(data instanceof Array){
			for(var i = 0; i < data.length; i++){
				var controlUnits = ControlUnitFinder.find(data[i]);     //Get all control units that matches the filter
                var commands = createCommands(controlUnits, data[i]);   //Create commands that is to be sent to each matching control unit
                allCommands = allCommands.concat(commands);
			}
		}else{ 
			var controlUnits = ControlUnitFinder.find(data);            //Get all control units that matches the filter
			var commands = createCommands(controlUnits, data);          //Create commands that is to be sent to each matching control unit
			allCommands = allCommands.concat(commands);
		}
		
		//Group the commands by the same API key
		var apiGroups = groupByApiKey(allCommands);
		
		//Send the commands to each control unit
		for(var apiKey in apiGroups){ 
			var commands = apiGroups[apiKey];
			
			console.log('\n----- Sending command to control unit ----------');
			printCommands(commands);
            
			Stream.get(apiKey).emit(commands);  //Get the communication channel of the control unit and send the commands to it
		}
	}
    
    /**
     * Prints out the commands in a human readable way. This is used only for debugging.
     *
     * @param commands  the commands that is to be printed
     */
    function printCommands(commands){
		for(var i = 0; i < commands.length; i++){
			console.log(String.format('--- Command {0} ---', i));
            
			var json = commands[i];
			for (var property in json) {
				console.log(String.format('{0}: {1}', property, json[property]));
			}
		}
	}
    
    /**
     * Groups commands by API key. Example output is:
     * {
     *     "3922023-23523-23dgg2-23422fg3": [{
     *                                          ...command1...
     *                                       },
     *                                       {
     *                                          ...command2...
     *                                       }],
     *      "ipgj34ip-3434g-34gk-g3g34g34": [{
     *                                          ...command3...
     *                                       }]
     *  }                                            
     *
     * @param commands  the commands that is to be grouped
     */
    function groupByApiKey(commands){
        var apiGroups = {};
		
		commands.forEach(function(command) {
			var apiKey = command.apiKey;
			
			if(!apiGroups[apiKey]) {
				apiGroups[apiKey] = [];
				apiGroups[apiKey].push(command);
			} else {
				apiGroups[apiKey].push(command);
			}
		});
		
		return apiGroups;
    }
    
    /**
     * Create commands that is to be sent to the control units
     *
     * @param controlUnits  the control units where the command is to be sent to
     * @param data          the data containing the information that is to be sent to the control unit
     */
    function createCommands(controlUnits, data){
        if((data.propertyName === undefined || data.setPropertyValue === undefined) && 
           (data.methodName === undefined || data.methodParameters === undefined)) {
                throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Unable to send command to control unit. 'propertyName' and 'setPropertyValue' or 'methodName' and 'methodParameters' must be set.");
		}
        
        var commands = [];
        
        controlUnits.forEach(function(controlUnit) {
            controlUnit.devices.forEach(function(device) {
                device.components.forEach(function(component) {
                    if(data.setPropertyValue) {
                        commands.push({
                                            apiKey: controlUnit.apiKey,
                                            deviceId: device.id,
                                            componentId: component.id,
                                            propertyName: data.propertyName,
                                            setPropertyValue: data.setPropertyValue
                                       });
                    }
                    
                    if(data.methodName) {
                        commands.push({
                                            apiKey: controlUnit.apiKey,
                                            deviceId: device.id,
                                            componentId: component.id,
                                            methodName: data.methodName,
                                            methodParameters: data.methodParameters
                                       });
                    }
                });
            });
        });
        
        return commands;
    }
	
	//return public functions
	return {
		send: send
	}
}());