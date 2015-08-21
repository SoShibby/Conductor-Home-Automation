try {
    if (!ActionFunctions) {

    }
} catch (ex) {
    ActionFunctions = {};
}

_.extend(ActionFunctions, {
    decreaseBy: function(options, filter) {
        var components = ComponentFinder.find(filter);

        if (components.length === 0) {
            console.log('No components found in action function "DecreaseBy"');
            throw new Error('No components found in action function "DecreaseBy"');
       }

        var component = components[0];
        var currentValue = component.properties[filter.propertyName].value;
        var newValue = currentValue - options.decreaseBy;

        if (newValue < options.minValue) {
            newValue = options.minValue;
        }

        return newValue;
    }
});