/**
 * Handles the insertion and retrieving of control units from and to the database
 */
ControlUnitRepository = (function() {

    /**
     * Creates and adds a new control unit to the database
     *
     * @param userId   the id of the user who "owns" this control unit
     * @param name     the name of the new control unit
     */
    function add(userId, name){
        Assert.isString(userId, "Parameter userId must be a string");
        Assert.isString(name, "Parameter name must be a string");
        
        var apiKey = Authentication.createApiKey(Authentication.AccessLevel.CONTROL_UNIT);
        var controlUnitId = GUID.createGUID();
        
        ControlUnits.insert({ 
                                controlUnitId: controlUnitId, 
                                name: name, 
                                apiKey: apiKey,
                                owner: userId,
                                connection: {
                                    isConnected: true,
                                    lastHeartbeat: new Date()
                                }
                            });
                            
        return controlUnitId;
    }
    
    /**
     * Removes a control unit with a given id from the database
     *
     * @param controlUnitId  the id of the control unit which is to be removed
     * @throw Error          if the given control unit id does not exist
     */
    function remove(controlUnitId){
        Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
        
        if(!exists(controlUnitId))
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Unable to remove control unit, no control unit exists with the id '" + controlUnitId + "'");
        
        ControlUnits.remove({
                                controlUnitId: controlUnitId
                            });
    }
    
    /**
     * Get the name of the control unit with a given id
     *
     * @param controlUnitId  the id of the control unit we are looking for
     * @return               the name of the control unit
     * @throw Error          if no control unit exist with the given id
     */
    function getNameById(controlUnitId){
        Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
        
        var controlUnit = ControlUnits.findOne({ 
                                                    controlUnitId: controlUnitId 
                                                });
        
        if(!controlUnit)
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Couldn't find a control unit by that id");
            
        return controlUnit.name;
    }
    
    /**
     * Get the id of the control unit that is associated with the given API key
     *
     * @param apiKey  the API key of the control unit that we are looking for
     * @return        the id of the control unit
     * @throw Error   if no control unit exist with the given API key
     */
    function getControlUnitIdByApiKey(apiKey){
        Assert.isString(apiKey, "Parameter apiKey must be a string");
        
        var controlUnit = ControlUnits.findOne({ apiKey: apiKey });
        
        if(!controlUnit)
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Couldn't find a control unit with the apiKey '" + apiKey + "'");
        
        return controlUnit["controlUnitId"];
    }
    
    /**
     * Returns an array of all control units that is associated with a certain owner
     *
     * @param ownerId  the id of the owner that we want to fetch all the control units for
     * @return         an array of all control units that is associated with a certain owner
     */
    function getControlUnitsByOwnerId(ownerId){
        Assert.isString(ownerId, "Parameter ownerId must be a string");
        
        return ControlUnits.find({ owner: ownerId }).fetch();
    }
    
    /**
     * Get the API key of a control unit with a given id
     *
     * @param controlUnitId  the id of the control unit that we are looking for
     * @return               the API key that is associated with the control unit
     * @throw Error          if not control unit exist with the given id
     */
    function getApiKey(controlUnitId){
        Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
        
        var controlUnit = ControlUnits.findOne({ controlUnitId: controlUnitId });
        
        if(!controlUnit)
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Couldn't find a control unit with the controlUnitId '" + controlUnitId + "'");
        
        return controlUnit["apiKey"];
    }
    
    /**
     * Retrieves all control units in the database
     *
     * @return  returns all control units in the database
     */
    function getAll(){
        return ControlUnits.find().fetch();
    }
    
    /**
     * Check if a control unit exist with a given id
     *
     * @param controlUnitId  the id of the control unit that we are looking for
     * @return               true if the control unit exist otherwise return false
     */
    function exists(controlUnitId){
        Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
        
        var controlUnit = ControlUnits.findOne({ 
                                                    controlUnitId: controlUnitId 
                                                });
        return controlUnit !== undefined;
    }
    
    /**
     * Set a new name for the control unit
     *
     * @param controlUnitId  the id of the control unit that we want to change the name of
     * @param name           the new name that we want to set for the control unit
     * @throw Error          if the controlUnitId or name is not a string or if  
     *                       no control unit exist with the given id
     */
    function setName(controlUnitId, name){
        Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
        Assert.isString(name, "Parameter name must be a string");
        
        if(!exists(controlUnitId))
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Unable to set name of control unit, no control unit exists with the id '" + controlUnitId + "'");
        
        ControlUnits.update({
                                controlUnitId: controlUnitId
                            },
                            {
                                $set: {
                                            name: name
                                        } 
                            });
    }
    
    /**
     * Get the id of the user who is the owner of this control unit
     *
     * @param controlUnitId  the id of the control unit which we are looking for
     * @return               the id of the user who owns the control unit
     * @throw Error          if the control unit is not a string or if no control unit
     *                       is found with the given id
     */
    function getOwner(controlUnitId){
        Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
        
        if(!exists(controlUnitId))
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Unable to set owner of control unit, no control unit exists with the id '" + controlUnitId + "'");
        
        var controlUnit = ControlUnits.findOne({
                                                controlUnitId: controlUnitId
                                             });
                             
        return controlUnit.owner;
    }
    
    /**
     * Set a new owner of a certain control unit
     *
     * @param userId         the id of the user who is to be set as the new owner
     * @param controlUnitId  the id of the control unit that is getting a new owner
     * @throw Error          if the controlUnitId or userId is not a string or if 
     *                       no control unit exist with the given id
     */
    function setOwner(userId, controlUnitId){
        Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
        Assert.isString(userId, "Parameter name userId be a string");
        
        if(!exists(controlUnitId))
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Unable to set owner of control unit, no control unit exists with the id '" + controlUnitId + "'");
        
        ControlUnits.update({
                                controlUnitId: controlUnitId
                            },
                            {
                                $set: {
                                            owner: userId
                                        } 
                            });
    }
    
    /**
     * Check if a user with a certain id is the owner of the control unit
     *
     * @param userId         the id of the user that is to be checked if he/she 
     *                       is the owner of the control unit
     * @param controlUnitId  the id of the control unit that is to be checked
     * @return               true if the user is the owner of the control unit,
     *                       otherwise return false
     * @throw Error          if the controlUnitId or userId is not a string or 
     *                       if no control unit exist with the given id
     */
    function isOwner(userId, controlUnitId){
        Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");
        Assert.isString(userId, "Parameter userId must be a string");
        
        if(!exists(controlUnitId))
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Unable to set owner of control unit, no control unit exists with the id '" + controlUnitId + "'");
        
        var controlUnit = ControlUnits.findOne({
                                                    owner: userId,
                                                    controlUnitId: controlUnitId
                                                });
                            
        return controlUnit !== undefined;
    }
    
    // return public functions
    return {
        add: add,
        remove: remove,
        getNameById: getNameById,
        getControlUnitIdByApiKey: getControlUnitIdByApiKey,
        getControlUnitsByOwnerId: getControlUnitsByOwnerId,
        getApiKey: getApiKey,
        getAll: getAll,
        exists: exists,
        setName: setName,
        getOwner: getOwner,
        setOwner: setOwner,
        isOwner: isOwner
    }
}());