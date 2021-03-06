ControlUnitFinder = (function() {

    /**
     * Finds matching control units
     *
     * @param filter  optional parameter used for filtering out unwanted control units, if no filter is used then all control units will be returned
     * @return        array of control units that matches the filter used
     */
    function find(filter){
        var devices = DeviceFinder.find(filter);    //Get all devices and components that matches the given filter.
        var uniqueControlUnitIds = getUniqueControlUnitIds(devices);

        var selector = { controlUnitId: { $in: uniqueControlUnitIds }};
        var controlUnits = ControlUnits.find(selector).fetch();

        controlUnits = addDevicesToControlUnits(controlUnits, devices);

        return controlUnits;
    }

    function addDevicesToControlUnits(controlUnits, devices){
        controlUnits.forEach(function(controlUnit) {
            controlUnit.devices = [];

            devices.forEach(function(device) {
                if(device.controlUnitId === controlUnit.controlUnitId)
                    controlUnit.devices.push(device);
            });
        });

        return controlUnits;
    }

    function getUniqueControlUnitIds(devices){
        var uniqueControlUnitIds = new Array();

        for(var i = 0; i < devices.length; i++){
            var controlUnitId = devices[i].controlUnitId;

            if(uniqueControlUnitIds.indexOf(controlUnitId) === -1)
               uniqueControlUnitIds.push(controlUnitId);
        }

        return uniqueControlUnitIds;
    }

    //Return public functions
    return {
        find: find
    }
}());