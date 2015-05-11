EventTransformer = (function() {
    function transform(events) {
        var convertedEvents = [];
        
        // Transform all events to our custom event data structure
        events.forEach(function(event) {
            convertedEvents.push(transformEvent(event));
        });
        
        return convertedEvents;
    }
    
    function transformEvent(event) {
        return {
            start: moment(event.start.dateTime).toDate(),
            end: moment(event.end.dateTime).toDate(),
            summary: event.summary
        }
    }
    
    //Return public functions
    return {
        transform: transform
    }
}());