TriggerObserver = (function() {
    function check() {
        console.log("START CHECKING FOR TRIGGERS");
        var triggerActions = TriggerActions.find().fetch();

        triggerActions.forEach(function(triggerAction) {
            var previousTriggerStatus = triggerAction.triggered;
            var currentTriggerStatus = getTriggerStatus(triggerAction.triggers);

            if (currentTriggerStatus === previousTriggerStatus) {
                return;
            }

            if (currentTriggerStatus === true) {
                sendActions(triggerAction.actions);
            }

            TriggerActionRepository.setTriggered(triggerAction._id, currentTriggerStatus);
        });

        console.log("FINISHED CHECKING FOR TRIGGERS");
    }

    function sendActions(actions) {
        actions.forEach(function(action) {
            sendAction(action);
        })
    }

    function sendAction(action) {
        if (action.function) {
            var actionFunction = ActionFunctionFactory.get(action.function.name);
            action.value.propertyValue = actionFunction(action.function.options, action.filter);
            Controller.send(action);
        } else {
            Controller.send(action);
        }
    }

    function getTriggerStatus(triggers) {
        return triggers.every(function(trigger) {
            switch (trigger.triggerType) {
                case 'deviceProperty':
                    return isPropertyTriggered(trigger);
                case 'calendarEvent':
                    return isCalendarEventTriggered(trigger);
                case 'deviceLocation':
                    return isDeviceLocationTriggered(trigger);
                default:
                    console.log("Invalid trigger type in getTrigerStatus in TriggerObserver.");
                    return false;
            }
        });
    }

    function isPropertyTriggered(trigger) {
        if (trigger.function && trigger.function.name === 'notEqual') {
            trigger.value = trigger.function.value;
            return DeviceFinder.find(trigger).length === 0;
        }

        return DeviceFinder.find(trigger).length !== 0;
    }

    function isCalendarEventTriggered(trigger) {
        //When searching for calendar events we need to specify a time interval.
        //This is because if an event happens at 15:00:00 and we get the current time as 15:00:01 we would get no results
        //so because of this we specify the interval as current time and 1 minute before. example 14:59:01 and 15:00:01
        var startInterval = moment().subtract(1, 'minutes');
        var endInterval = moment();
        startInterval.seconds(1);
        endInterval.seconds(1);

        //The timeOffset on the mapping is counted in minutes and is used for when you want something to happend
        //a certain amount of minutes before or after the event is due. Example if you have a google calendar event with
        //the name "work" at 15:00:00 and you want your wake up clock to ring 20 minutes before, you add -20 to the mappings timeoffset
        //and "work" as the map name
        startInterval.add(-trigger.timeOffset, 'minutes');
        endInterval.add(-trigger.timeOffset, 'minutes');

        var events = CalendarFacade.getCalendarEvents(trigger.userAccess);

        // Remove events that isn't in the interval that we are looking for
        if (trigger.triggerWhen === 'startEvent') {
            events = events.filter(function(event) {
                return (event.start >= startInterval && event.start <= endInterval);
            });
        } else if (trigger.triggerWhen === 'endEvent') {
            events = events.filter(function(event) {
                return (event.end >= startInterval && event.end <= endInterval);
            });
        } else if (trigger.triggerWhen === 'duringEvent') {
            events = events.filter(function(event) {
                return (event.start <= endInterval && event.end >= endInterval);
            });
        }

        return events.some(function(event) {
            //Check if the google calendar event summary is the same as the trigger name
            return (event.summary.toLowerCase() == trigger.calendarEventName.toLowerCase());
        });
    }

    function isDeviceLocationTriggered(trigger) {
        switch (trigger.triggerWhen) {
            case 'deviceEnters':
                return DeviceFinder.find(trigger).length !== 0;
            case 'deviceLeaves':
                return DeviceFinder.find(trigger).length === 0;
        }
    }

    // Return public functions
    return {
        check: check
    }
}());