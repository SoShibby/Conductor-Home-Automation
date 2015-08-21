try {
    if (!ActionFunctions) {

    }
} catch (ex) {
    ActionFunctions = {};
}

_.extend(ActionFunctions, {
    increaseBy: function(options, filter) {
        var components = ComponentFinder.find(filter);

        if (components.length === 0) {
            console.log('No components found in action function "IncreaseBy"');
            throw new Error('No components found in action function "IncreaseBy"');
       }

        var component = components[0];
        var currentValue = component.properties[filter.propertyName].value;
        var newValue = currentValue + options.increaseBy;

        if (newValue > options.maxValue) {
            newValue = options.maxValue;
        }

        return newValue;
    }
});