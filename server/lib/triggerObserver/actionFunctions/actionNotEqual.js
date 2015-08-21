try {
    if (!ActionFunctions) {

    }
} catch (ex) {
    ActionFunctions = {};
}

_.extend(ActionFunctions, {
    notEqual: function(options, filter) {
        var components = ComponentFinder.find(filter);

        if (components.length === 0) {
            console.log('No components found in action function "notEqual"');
            throw new Error('No components found in action function "notEqual"');
       }

        var component = components[0];
        var currentValue = component.properties[filter.propertyName].value;
        var newValue = currentValue - options.value;

        return newValue;
    }
});