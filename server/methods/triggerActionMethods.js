Meteor.methods({
    addTriggerAction: function(name, triggers, actions) {
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);

        Assert.isString(name, "Parameter name must be a string");

        console.log(triggers);

        if(!TriggerActionRepository.isValidTriggers(triggers)) {
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Invalid triggers.");
        }

        if(!TriggerActionRepository.isValidActions(actions)) {
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Invalid actions.");
        }

        var userId = this.userId;

        triggers = triggers.map(function(trigger) {
            trigger.userAccess = userId;
            return trigger;
        });

        actions = actions.map(function(action) {
            action.filter.userAccess = userId;
            return action;
        });

        TriggerActionRepository.add(this.userId, name, triggers, actions);
    },
    removeTriggerAction: function(id) {
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);

        if(!TriggerActionRepository.isOwner(id, this.userId)) {
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED, "Only the owner of the trigger - action can remove it.");
        }

        TriggerActionRepository.remove(id);
    }
});