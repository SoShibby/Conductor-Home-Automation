Meteor.methods({
    shareCalendar: function(email){
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
        
        Assert.validEmail(email, "Invalid email address.");
        
        var calendarId = CalendarFacade.getCalendarId(this.userId);
        
        CalendarFacade.shareCalendar(calendarId, email);
    },
    refreshEvents: function() {
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
        
        CalendarFacade.refreshEvents(this.userId);
    },
    addCalendarEventMapping: function(eventName, command, timeOffset) {
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
        
        Assert.isString(eventName, "Parameter 'event name' must be a string value");
        Assert.isInt(timeOffset, "Parameter 'time offset' must be a int value");
        
        // Verify that the command parameter is a valid command
        
        CalendarMapping.add(this.userId, eventName, command, timeOffset);
    },
    removeCalendarEventMapping: function(mappingId) {
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
        
        if(!CalendarMapping.isOwner(this.userId, mappingId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED, "Only the owner of the calendar mapping can remove it.");
            
        CalendarMapping.remove(mappingId);
    }
});