Template.CreateCalendarMapping.events({
    'click .js-create-mapping': function(event, template) {
        var form = template.find('form');
        var formData = $(form).serializeObject();

        try{
			var jsonCommand = JSON.parse(formData.command);
		}catch(error){
			MessageBox.displayError("Error", "Invalid command. Command is not a valid json object: " + error);
			return false;
		}

		if(tryParseInt(formData.timeOffset)){
			var timeOffset = parseInt(formData.timeOffset);
		}else{
			MessageBox.displayError("Error", "Invalid time offset.");
			return false;
		}

		Meteor.call('addCalendarEventMapping', formData.eventName, jsonCommand, timeOffset, function(error, result){
		    if(error){
                MessageBox.displayInfo("Failed to create calendar event mapping", "An error occurred when creating calendar event mapping. The error message was: " + error);
            }else{
                Blaze.remove(template.view);
                $(template.firstNode).remove();
            }
        });
    },
    'click .js-close': function(event, template){
        Blaze.remove(template.view);
        $(template.firstNode).remove();
    },
	'keydown textarea': function(event, template){		//Fix so we can use tab to indent lines in textareas
		var keyCode = event.keyCode || event.which;
		var $this = $(event.target);

		if (keyCode == 9) {
			event.preventDefault();
			var start = $this.get(0).selectionStart;
			var end = $this.get(0).selectionEnd;

			// set textarea value to: text before caret + tab + text after caret
			$this.val($this.val().substring(0, start)
				+ "\t"
				+ $this.val().substring(end));

			// put caret at right position again
			$this.get(0).selectionStart = $this.get(0).selectionEnd = start + 1;
		}
	}
});

function tryParseInt(value){
	if(value !== null){
		if(value.length > 0){
			return !isNaN(value);
		}
	}

	return false;
}