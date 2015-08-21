TriggerActionRepository = (function() {
    function add(userId, name, triggers, actions) {
        Assert.isString(name, "Parameter name must be a string");
        Assert.isArray(triggers, "Parameter triggers must be an array");
        Assert.isArray(actions, "Parameter actions must be an array");

        if (!isValidTriggers(triggers)) {
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Parameter 'triggers' is not in a valid format");
        }

        if (!isValidActions(actions)) {
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Parameter 'actions' is not in a valid format");
        }

        // Check if triggers and actions is valid
        TriggerActions.insert({
            name: name,
            triggers: triggers,
            actions: actions,
            triggered: false,
            owner: userId
        });
    }

    function isValidTriggers(triggers) {
        // If the triggers is not an array then this isn't a valid trigger
        if (!isArray(triggers)) {
            return false;
        }

        // Loop through all triggers
        return triggers.every(function(trigger) {
            switch (trigger.triggerType) {
                case 'deviceProperty':
                    return isValidPropertyTrigger(trigger);
                case 'calendarEvent':
                    return isValidCalendarEventTrigger(trigger);
                case 'deviceLocation':
                    return isValidDeviceLocationTrigger(trigger);
                default:
                    return false;
            }
        });
    }

    function isValidPropertyTrigger(trigger) {
        // A valid trigger must be an object
        if (!isObject(trigger)) {
            return false;
        }

        // Check that all the properties in the trigger is of the type string, number or boolean
        if (!isValidProperties(trigger)) {
            return false;
        }

        return true;
    }

    function isValidCalendarEventTrigger(trigger) {
        // A valid trigger must be an object
        if (!isObject(trigger)) {
            return false;
        }

        // Check that all the properties in the trigger is of the type string, number or boolean
        if (!isValidProperties(trigger)) {
            return false;
        }

        if (!trigger.calendarEventName || !trigger.triggerWhen) {
            return false;
        }

        if (trigger.calendarEventName.length === 0) {
            return false;
        }

        if (!_.contains(['startEvent', 'duringEvent', 'endEvent'], trigger.triggerWhen)) {
            return false;
        }

        if (!isInt(trigger.timeOffset)) {
            return false;
        }

        return true;
    }

    function isValidDeviceLocationTrigger(trigger) {
        // A valid trigger must be an object
        if (!isObject(trigger)) {
            return false;
        }

        // Check that all the properties in the trigger is of the type string, number or boolean
        if (!isValidProperties(trigger)) {
            return false;
        }

        if (!trigger.controlUnitId || !trigger.deviceId || !trigger.locationName || !trigger.triggerWhen) {
            return false;
        }

        if (trigger.locationName.length === 0) {
            return false;
        }

        if (!_.contains(['deviceEnters', 'deviceLeaves'], trigger.triggerWhen)) {
            return false;
        }

        return true;
    }

    function isInt(variable, errorMessage) {
        return (typeof variable == "number" && isFinite(variable) && variable % 1 === 0);
    }

    function isValidActions(actions) {
        // If the actions is not an array then this isn't a valid action
        if (!isArray(actions)) {
            return false;
        }

        // Loop through all actions
        return actions.every(function(action) {
            // A valid action must be an object
            if (!isObject(action)) {
                return false;
            }

            // An action must contain a filter, that is an object
            if (!isObject(action.filter)) {
                return false;
            }

            // An action must contain a value, that is an object
            if (!isObject(action.value)) {
                return false;
            }

            // Check that all the properties in the action is of the type string, number or boolean
            if (!isValidProperties(action.filter)) {
                return false;
            }

            if (!isValidProperties(action.value)) {
                return false;
            }

            return true;
        });
    }

    function isObject(variable) {
        return typeof variable === "object";
    }

    function isArray(variable) {
        return Object.prototype.toString.call(variable) === '[object Array]';
    }

    function isValidProperties(properties) {
        for (var key in properties) {
            var prop = properties[key];
            var propType = typeof prop;

            if (!_.contains(['string', 'number', 'boolean', 'object'], propType)) {
                return false;
            }
        }

        return true;
    }

    function setTriggered(id, triggered) {
        TriggerActions.update({
            _id: id
        }, {
            $set: {
                triggered: triggered
            }
        });
    }

    function isOwner(id, userId) {
        var triggerAction = TriggerActions.findOne({
            _id: id,
            owner: userId
        });

        return triggerAction !== undefined;
    }

    function remove(id) {
        var result = TriggerActions.remove({
            _id: id
        });

        if (result === 0) //If no record was removed then throw error as this means no device was found
            throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Unable to remove trigger - action, no trigger - action exist with id " + id + ".");
        else
            return true; //If one or more record was successfully removed then return true
    }

    // Return public functions
    return {
        add: add,
        isValidTriggers: isValidTriggers,
        isValidActions: isValidActions,
        setTriggered: setTriggered,
        remove: remove,
        isOwner: isOwner
    }
}());