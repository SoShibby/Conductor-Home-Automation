var streams = [];

/**
 * Class for handling the creation of communication channels based on web sockets
 */
Stream = (function() {

    /**
     * Create a new communication stream
     *
     * @param   id  an unique id of the communication stream that is to be created
     */
    function create(id){
        if(streams[id] !== undefined)
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Failed to create a new communication stream. A communication stream with id '" + id + "' already exists.");

        var stream = new Meteor.Stream(id);

        stream.permissions.write(function(eventName) {
            return false;
        });

        stream.permissions.read(function(eventName) {
            return true;
        });

        streams[id] = stream;

        return stream;
    }

    /**
     * Get a communication stream with a certain id
     *
     * @param   id  the id of the communication stream that is to be retrieved
     * @return      returns the communication stream if it exists otherwise returns undefined
     */
    function get(id){
        return streams[id];
    }

    //Return public functions
    return {
        create: create,
        get: get
    }
}());