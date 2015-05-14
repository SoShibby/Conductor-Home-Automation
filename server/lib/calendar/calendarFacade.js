CalendarFacade = (function() {
	function createCalendar(userId, calendarName) {
		Calendar.addCalendar(calendarName, function(error, calendar) {
			if(error) {
				throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Error when creating a new google calendar with name '" + calendarName + "', error message was: " + error);
			} else {
				var calendarId = calendar.id;
				
				Feeds.upsert({
								owner: userId
							},
							{
								$set: {
											'calendar.calendarId': calendarId,
											'calendar.events': []
										}
							},
							{
								upsert: true
							});
				
			}
		});
	}
    
	function shareCalendar(calendarId, email) {
		Calendar.setAccess(calendarId, email, "owner", function(error, result) {
			if(error) {
				throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Error when setting Google calendar access for user '" + email + "' with calendar id '" + calendarId + "', error message: " + error);
 			}
		});
	}
    
	function getCalendarId(userId) {
		var feed = Feeds.findOne({ owner: userId });
		
		if(!feed || !feed.calendar || !feed.calendar.calendarId)
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "No calendar exist for this user");
			
		return feed.calendar.calendarId;
	}
    
	function refreshEvents(userId) {
		var calendarId = getCalendarId(userId);
		var startDate = moment().subtract(1, 'day');
        var endDate = moment().add(14, 'day');
        
        Calendar.getEventsByInterval(calendarId, startDate, endDate, (function(calendarId) {
            return function(error, data) {
                if(error) {
                    throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "Error when fetching calendar events: " + error);
                } else {
                    var events = EventTransformer.transform(data.items);
                    
                    Feeds.upsert({
                                    'calendar.calendarId': calendarId
                                 },
                                 {
                                    $set: {
                                                'calendar.events': events
                                          }
                                 },
                                 {
                                    upsert: true
                                 });
                }
            }
        })(calendarId));
	}
    
    function getCalendarEvents(userId) {
        var feed = Feeds.findOne({ owner: userId });
        
        if(!feed.calendar || !feed.calendar.events)
            return [];
        
        return feed.calendar.events;
    }
    
    // Return public functions
    return {
        createCalendar: createCalendar,
        shareCalendar: shareCalendar,
        refreshEvents: refreshEvents,
        getCalendarEvents: getCalendarEvents,
        getCalendarId: getCalendarId
    }
}());

