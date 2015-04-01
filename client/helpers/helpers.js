Template.registerHelper('isArrayOfSize', function(array, arraySize) {
	return array.length === arraySize;
});

Template.registerHelper('equals', function(v1, v2) {
	return (v1 === v2);
});