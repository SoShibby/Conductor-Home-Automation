ComponentFinder = (function() {

    /**
     * Finds matching components
     *
     * @param filter  optional parameter used for filtering out unwanted components, if no filter is used then all components will be returned
     * @return        array of components that matches the filter used
     */
    function find(filter){
        var devices = DeviceFinder.find(filter);    //Get all devices and components that matches the given filter.
        var components = new Array();

        //Loop through all devices and concat all the components
        for(var i = 0; i < devices.length; i++){
            components = components.concat(devices[i].components);
        }

        //Return all matching components
        return components;
    }

    //Return public functions
    return {
        find: find
    }
}());