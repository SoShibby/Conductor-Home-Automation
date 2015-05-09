Meteor.methods({
    addFriend: function(email){
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
        
        var friendId = User.getUserIdByEmail(email);
        
        if(this.userId === friendId)
            throw new Meteor.Error(ErrorCode.INVALID_DATA_SUPPLIED, "You can't add yourself as a friend.");
            
        FriendshipManager.makeFriendRequest(this.userId, friendId);
    },
    removeFriend: function(friendUserId){
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
        
        FriendshipManager.removeFriend(this.userId, friendUserId);
        
        //Remove device access for the friend that was removed
        var controlUnits = ControlUnitRepository.getControlUnitsByOwnerId(this.userId);
        
        controlUnits.forEach(function(controlUnit) {
            var devices = DeviceRepository.getDevicesByControlUnitId(controlUnit.controlUnitId);
            
            devices.forEach(function(device) {
                DeviceRepository.removeUserAccess(friendUserId, controlUnit.controlUnitId, device.id);
            });
        });
        
        //Remove device access for the friend that was removed
        var controlUnits = ControlUnitRepository.getControlUnitsByOwnerId(friendUserId);
        
        controlUnits.forEach(function(controlUnit) {
            var devices = DeviceRepository.getDevicesByControlUnitId(controlUnit.controlUnitId);
            
            devices.forEach(function(device) {
                DeviceRepository.removeUserAccess(this.userId, controlUnit.controlUnitId, device.id);
            });
        });
    },
    removeUnconfirmedFriend: function(friendUserId){
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
        
        FriendshipManager.declineFriendRequest(this.userId, friendUserId);
    },
    acceptFriendRequest: function(friendUserId){
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
        
        FriendshipManager.acceptFriendRequest(this.userId, friendUserId);
    },
    declineFriendRequest: function(friendUserId){
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
        
        FriendshipManager.declineFriendRequest(this.userId, friendUserId);
    },
});