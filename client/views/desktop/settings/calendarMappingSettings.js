Template.CalendarMappingSettings.helpers({
    value: function() {
        var jsonString = JSON.stringify(this.value, undefined, 4);
        return syntaxHighlight(jsonString);
    }
});

Template.CalendarMappingSettings.events({
    'click .js-create-mapping': function(event, template) {
		var body = $('body')[0];
		Blaze.render(Template.CreateCalendarMapping, body);
	},
    'click .js-remove-mapping': function(event, template) {
        Meteor.call('removeCalendarEventMapping', this._id, function(error, result){
            if(error){
                MessageBox.displayError("Failed to remove event mapping", "An error occurred when removing event mapping. The error message was: " + error);
            }else{
                MessageBox.displayInfo("Success", "Event mapping was removed successfully.");
            }
        });
    }
});

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}