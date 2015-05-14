var selectedUser = new ReactiveVar(undefined);
var selectedControlUnit = new ReactiveVar(undefined);

Template.DeviceSettings.helpers({
    devices: function(){
        var selectedUserId = selectedUser.get();
        var selectedControlUnitId = selectedControlUnit.get();
        
        if(!selectedUserId && !selectedControlUnitId)   //If no filters are used then return all devices
            return Devices.find().fetch();
        
        var filter = {};
        
        if(selectedUserId){     //Filter by user id
            filter.owner = selectedUserId;
        }
        
        if(selectedControlUnitId){      //Filter by control unit
            filter.controlUnitId = selectedControlUnitId;
        }
        
        //Fetch all devices that matches the filter
        var controlUnits = ControlUnits.find(filter).fetch();
        var controlUnitIds = controlUnits.map(function(controlUnit){ return controlUnit.controlUnitId });
        return Devices.find({ controlUnitId: { $in: controlUnitIds} }).fetch();
    },
    users: function(){
        var user = Meteor.user();
        
        if(!user || !user.friends)
            return [];
        
        //Fetch all friends and display them in the owner filter
        return Meteor.users.find({ _id: { $in: user.friends.confirmed }});
    },
    controlUnits: function(){
        var selectedUserId = selectedUser.get();
        
        if(selectedUserId){
            return ControlUnits.find({ owner: selectedUserId }).fetch();
        }else{
            return ControlUnits.find().fetch();
        }
    }
});

Template.DeviceSettings.events = {
    /* View device information */
    'click .js-info': function(event, template){
        var domRoot = $('body')[0];
        Blaze.renderWithData(Template.ViewDevice, { deviceId: this.id }, domRoot);
    },
    /* Filter by user */
    'change .filter.user select': function(event, template){
        var select = template.find('.filter.user select');
        var userId = select.value;
        
        if(userId === "")
            selectedUser.set(undefined);
        else
            selectedUser.set(userId);
            
        $(template.find('.filter.control-unit select')).val("").change();   //select the "show all" option in the control units filter
    },
    /* Filter by control unit name */
    'change .filter.control-unit select': function(event, template){
        var select = template.find('.filter.control-unit select');
        var controlUnitId = select.value;
        
        if(controlUnitId === "")
            selectedControlUnit.set(undefined);
        else
            selectedControlUnit.set(controlUnitId);
    }
}
