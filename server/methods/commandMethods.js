Meteor.methods({
    sendCommand: function(filter, value){
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);

        Assert.isObject(filter, "The parameter named 'filter' must be an object.");
        Assert.isObject(value, "The parameter named 'value' must be an object.");

        filter.userAccess = this.userId;    // We need to filter devices based on user access, so the user can only send commands to the devices that he/she got access to.

        Controller.send({
                            filter: filter,
                            value: value
                        });
    }
});