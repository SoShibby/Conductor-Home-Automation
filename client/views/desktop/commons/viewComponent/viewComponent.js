var currentDate = new ReactiveVar(new Date());

Template.ViewComponent.helpers({
    component: function() {
        var device = Devices.findOne({ 'components.id': this.componentId });
        
        if(!device) {   //If no device was found containing the component that we are looking for then just return an empty object
            return {};
        }
        
        device.components.filter(function(component, index, array) {
            return (component.id === this.componentId);
        });
        
        return (device.components.length > 0) ? device.components[0] : {};
    },
    properties: function() {
        //Blaze can't loop through object values, so we need to convert it into an array first
        var result = [];
        
        for (var propertyName in this.properties) {      
            var obj = this.properties[propertyName];
            obj.name = propertyName;
            result.push(obj);
        }
        
        return result;
    },
    value: function() {
        return this.value.toString();
    },
    methods: function() {
        //Blaze can't loop through object values, so we need to convert it into an array first
        var result = [];
        
        for (var methodName in this.methods) {     
            var method = {};
            method.name = methodName;
            method.parameters = [];
            
            var parameters = this.methods[methodName].parameters;
            for (var parameterName in parameters) {
                var parameter = {};
                parameter.name = parameterName;
                parameter.dataType = parameters[parameterName];
                method.parameters.push(parameter);
            }
            
            result.push(method);
        }
        
        return result;
    },
    updated: function() {
        var updated = moment(this.updated);     //Get the date when the property value was last updated

        //We use a reactive variable to get the current date,
        //this is done because we want the date to update every seconds,
        //and if we would have just used 'new Date()' it would have just updated the date once
        var dateNow = moment(currentDate.get());    
        
        return updated.from(dateNow);   //Get the time difference between the current date and the date the property was last updated
    }
});

Template.ViewComponent.events({
    'click .js-close': function(event, template) {
        Blaze.remove(template.view);
        $(template.firstNode).remove();
    }
});

//Updated the current date every second
setInterval(function() {
    currentDate.set(new Date());
}, 1000);