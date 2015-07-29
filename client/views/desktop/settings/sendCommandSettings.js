Template.SendCommandSettings.events({
    'click .js-set-property': function(event, template){
        var form = template.find('form#set-property');
        var formData = $(form).serializeObject();

        try{
            var filter = JSON.parse(formData.filter);
        }catch(error){
            MessageBox.displayError("Error", "Invalid filter. The filter is not a valid JSON object: " + error);
            return false;
        }

        var propertyValue = convertToDataType(formData.propertyValue, formData.dataType);

        if(propertyValue === undefined)
            return false;

        Meteor.call('sendCommand', filter, { propertyValue: propertyValue }, function(error, result){
            if(error){
                MessageBox.displayError("Failed to send command", "An error occurred when sending command. The error message was: " + error);
            }else{
                MessageBox.displayInfo("Success", "Command sent to server successfully!");
            }
        });

        return false;
    },
    'keydown textarea': function(event, template){      //Fix so we can use tab to indent lines in textareas
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

function convertToDataType(value, dataType) {
    switch(dataType) {
        case "integer":
            return parseInt(value);
        case "double":
            return parseFloat(value);
        case "boolean":
            switch(value) {
                case "true":
                    return true;
                case "false":
                    return false;
                default:
                    MessageBox.displayError("Error", "Invalid property value. Can't convert property value to boolean.");
                    return undefined;
            }
        case "string":
            return value;
        default:
            MessageBox.displayError("Error", "Unsupported data type.");
            return undefined;
    }
}