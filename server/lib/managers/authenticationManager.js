/**
 * Authentication is the class that handles the creating and verification of API keys.
 */
Authentication = (function() {

    /**
     * This is an object containing the different types of access levels available.
     */
    var AccessLevel = {
        CONTROL_UNIT: "ControlUnit"
    };

    /**
     * Creates a new API key with the supplied access level.
     *
     * @param  accessLevel  the access level that this API key should have
     * @return              an unique API key used for authentication
     */
    function createApiKey(accessLevel){
        Assert.isString(accessLevel, "Parameter accessLevel must be a string");

        var apiKey = GUID.createGUID();

        //Check if the requested access level is valid
        if(!contains(AccessLevel, accessLevel))
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Unknown access level");

        ApiKeys.insert({
                            apiKey: apiKey,
                            accessLevel: accessLevel
                       });

        return apiKey;
    }

    /**
     * Checks if a value exist in an object
     *
     * @param   object  the object that should be searched
     * @param   value   the value that we are looking for
     * @return          true if the value exist in the object otherwise returns false
     */
    function contains(obj, value) {
        for (key in obj) {
            if (obj[key] === value) {
                return true;
            }
        }
        return false;
    }

    /**
     * Removes an API key from the database
     *
     * @param  apiKey  the API key that is to be removed
     * @throws Error   if the API key doesn't exist in the database
     *                 or if the supplied API key isn't a string
     */
    function removeApiKey(apiKey){
        Assert.isString(apiKey, "Parameter apiKey must be a string");

        if(!existsApiKey(apiKey))
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "No api key exists with the key '" + apiKey + "'");

        ApiKeys.remove({
                            apiKey: apiKey
                       });
    }

    /**
     * Get all API keys that exists in the database
     *
     * @return  an array containing all API keys from the database
     */
    function getApiKeys(){
        return ApiKeys.find().fetch();
    }

    /**
     * Check whether an API key exist in the database
     *
     * @param  apiKey  the API key that should be checked
     * @return         true if the API key exist in the database otherwise false
     */
    function existsApiKey(apiKey){
        var apiKey = ApiKeys.findOne({
                                       apiKey: apiKey
                                     });

        return (apiKey !== undefined) ? true : false;
    }

    /**
     * Check whether a given API key exist and has the right access level
     *
     * @param   apiKey       the API key that should be checked
     * @param   accessLevel  the access level that the given API key should have
     * @return               true if the supplied API key exists and has the
     *                       correct access level otherwise return false
     */
    function authenticate(apiKey, accessLevel){
        if(!existsApiKey(apiKey))
            return false;

        var apiKey = ApiKeys.findOne({
                                          apiKey: apiKey,
                                          accessLevel: accessLevel
                                     });

        return apiKey !== undefined;
    }

    // return all public functions
    return {
        AccessLevel: AccessLevel,
        createApiKey: createApiKey,
        removeApiKey: removeApiKey,
        getApiKeys: getApiKeys,
        existsApiKey: existsApiKey,
        authenticate: authenticate
    }

}());

