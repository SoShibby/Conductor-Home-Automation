Meteor.methods({
    shareCalendar: function(email){
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
        
        Assert.validEmail(email, "Invalid email address.");
        
        var calendarId = CalendarFacade.getCalendarId(this.userId);
        
        CalendarFacade.shareCalendar(this.userId, email);
    },
    refreshEvents: function() {
        if(!User.isUserLoggedIn(this.userId))
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
        
        CalendarFacade.refreshEvents(this.userId);
    }
});