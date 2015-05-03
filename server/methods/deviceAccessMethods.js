Meteor.methods({
    addDeviceAccess: function(controlUnitId, deviceId, friendUserId){
		if(!User.isUserLoggedIn(this.userId)){
			throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
		}
		
		if(!ControlUnitRepository.isOwner(this.userId, controlUnitId)){
			throw new Meteor.Error(ErrorCode.UNAUTHORIZED, "Only the owner of this device can set device access.");
		}
		
		if(!DeviceRepository.exists(controlUnitId, deviceId)){
			throw new Meteor.Error(ErrorCode.DEVICE_NOT_FOUND, "No device exists with the device id '" + deviceId + "' in control unit '" + controlUnitId + "'");
		}
		
		if(!FriendshipManager.areFriends(this.userId, friendUserId)){
			throw new Meteor.Error(ErrorCode.FRIEND_NOT_FOUND, "You must be friend with the user you are giving device access to.");
		}
		
		if(DeviceRepository.hasUserAccess(friendUserId, controlUnitId, deviceId)){
			throw new Meteor.Error(ErrorCode.USER_ALREADY_HAS_DEVICE_ACCESS, "This user has already access to this device.");
		}
		
		DeviceRepository.addUserAccess(friendUserId, controlUnitId, deviceId);
	},
	removeDeviceAccess: function(controlUnitId, deviceId, friendUserId){
		if(!User.isUserLoggedIn(this.userId)){
			throw new Meteor.Error(ErrorHandler.ErrorCode.Unauthorized);
		}
		
		if(friendUserId !== this.userId){	//If the user id of who makes this request and the user id that is to be removed access device differs, then this means that the user is trying to remove access to another user, this is an action that is only allowed for the owner of this device.
			if(!ControlUnitRepository.isOwner(this.userId, controlUnitId)){
				throw new Meteor.Error(ErrorCode.UNAUTHORIZED, "Only the owner of this device can set device access.");
			}
		}
		
		if(!DeviceRepository.exists(controlUnitId, deviceId)){
			throw new Meteor.Error(ErrorCode.DEVICE_NOT_FOUND, "No device exists with the device id '" + deviceId + "' in control unit '" + controlUnitId + "'");
		}
		
		if(!DeviceRepository.hasUserAccess(friendUserId, controlUnitId, deviceId)){
			throw new Meteor.Error(ErrorCode.INVALID_DEVICE_ACCESS, "No user with that user id has access to this device.");
		}
		
		DeviceRepository.removeUserAccess(friendUserId, controlUnitId, deviceId);
	}
});