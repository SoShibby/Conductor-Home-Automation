ActionFunctionFactory = (function() {
    function get(functionName) {
        if (ActionFunctions[functionName] === undefined) {
            console.log('Unknown action function, no action function exist with the name "' + functionName + '"');
        }

        return ActionFunctions[functionName];
    }

    return {
        get: get
    }
})();