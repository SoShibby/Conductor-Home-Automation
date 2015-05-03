var selectedUser = new ReactiveVar(undefined);

Template.DeviceAccessSettings.helpers({
    friends: function() {
        //Select the first user in the friends list as default
        if(!selectedUser.get() && this.friends.length > 0){
            selectedUser.set(this.friends[0]);
        }
    
        return this.friends;
    },
    myDevices: function() {
        var controlUnits = ControlUnits.find({ owner: Meteor.userId() }).fetch();
        var controlUnitIds = controlUnits.map(function(controlUnit){ return controlUnit.controlUnitId });
        return Devices.find({ controlUnitId: { $in: controlUnitIds} }).fetch();	
    },
    receivedDevices: function() {
        if(!selectedUser.get()) 	//If no user has been selected then just exit
            return [];
            
        var controlUnits = ControlUnits.find({ owner: selectedUser.get()._id }).fetch();
        var controlUnitIds = controlUnits.map(function(controlUnit){ return controlUnit.controlUnitId });
        return Devices.find({ controlUnitId: { $in: controlUnitIds} }).fetch();	
    },
    isUserSelected: function() {		
        if(!selectedUser.get()) 	//If no user has been selected then just return an empty string
            return "";
        
        return (this._id === selectedUser.get()._id) ? "selected" : "";
    },
    hasAccess: function() {
        if(!selectedUser.get()) 	//If no user has been selected then just return an empty string
            return "";
            
        return hasUserDeviceAccess(selectedUser.get()._id, this) ? "confirmed" : "";
    },
    accessGivenTo: function() {
        if(!selectedUser.get()) 	//If no user has been selected then just return an empty string
            return "";
        
        return selectedUser.get().firstName + " " + selectedUser.get().lastName;
    },
    accessReceivedFrom: function() {
        if(!selectedUser.get()) 	//If no user has been selected then just return an empty string
            return "";
            
        return selectedUser.get().firstName + " " + selectedUser.get().lastName;
    },
    unconfirmedFriend: function() {
        var unconfirmedFriends = Meteor.user().friends.unconfirmed;
        return ($.inArray(this._id, unconfirmedFriends) !== -1) ? "unconfirmed" : "";
    },
    isFriend: function() {
        var confirmedFriends = Meteor.user().friends.confirmed;
        return ($.inArray(this._id, confirmedFriends) !== -1);
    },
    isUnconfirmedFriend: function() {
        var unconfirmedFriends = Meteor.user().friends.unconfirmed;
        return ($.inArray(this._id, unconfirmedFriends) !== -1);
    },
    isFriendRequestPending: function() {
        var friendRequests = Meteor.user().friends.requests;
        return ($.inArray(this._id, friendRequests) !== -1);
    },
    friendRequestPending: function() {
        var friendRequests = Meteor.user().friends.requests;
        return ($.inArray(this._id, friendRequests) !== -1) ? "unconfirmed": "";
    }
});

Template.DeviceAccessSettings.events({
	'click .user': function(event, template) {
		selectedUser.set(this);
	},
	'click .device': function(event, template) {
		if(hasUserDeviceAccess(selectedUser.get()._id, this)) {
			removeDeviceAccess(selectedUser.get()._id, this.controlUnitId, this.id);
		}else{
			addDeviceAccess(selectedUser.get()._id, this.controlUnitId, this.id);
		}
	},
	'click .js-add-friend': function(event, template) {
		var domRoot = $('body')[0];
		Blaze.render(Template.AddFriend, domRoot);
	},
	'click .js-remove-friend': function(event, template) {
		Meteor.call('removeFriend', this._id, function(error, result) {
			if(error){
				MessageBox.displayInfo("Failed to remove friend", "An error occurred when removing a friend. The error message was: " + error);
			}
		});
	},
	'click .js-remove-unconfirmed-friend': function(event, template) {
		Meteor.call('removeUnconfirmedFriend', this._id, function(error, result) {
			if(error){
				MessageBox.displayInfo("Failed to remove friend", "An error occurred when removing a friend. The error message was: " + error);
			}
		});
	},
	'click .js-accept-friend-request': function(event, template) {
		Meteor.call('acceptFriendRequest', this._id, function(error, result) {
			if(error){
				MessageBox.displayInfo("Failed to accept friend request", "An error occurred when trying to accept friend request. The error message was: " + error);
			}
		});
	},
	'click .js-decline-friend-request': function(event, template) {
		Meteor.call('declineFriendRequest', this._id, function(error, result) {
			if(error){
				MessageBox.displayInfo("Failed to decline friend request", "An error occurred when trying to decline friend request. The error message was: " + error);
			}
		});
	},
    'click .device .js-info': function(event, template) {
        var domRoot = $('body')[0];
		Blaze.renderWithData(Template.ViewDevice, this, domRoot);
        return false;
    }
});

function hasUserDeviceAccess(userId, device) {
	return $.inArray(userId, device.userAccess) !== -1;
}

function addDeviceAccess(userId, controlUnitId, deviceId) {
    Meteor.call('addDeviceAccess', controlUnitId, deviceId, userId, function(error, result) {
        if(error){
            MessageBox.displayInfo("Failed to add control unit", "An error occurred when creating a new control unit. The error message was: " + error);
        }
    });
}

function removeDeviceAccess(userId, controlUnitId, deviceId) {
	Meteor.call('removeDeviceAccess', controlUnitId, deviceId, userId, function(error, result) {
		if(error){
			MessageBox.displayError("Error", "Unable to remove device access. Error message: " + error);
		}
	});
}