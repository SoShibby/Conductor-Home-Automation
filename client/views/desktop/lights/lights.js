Template.Lights.helpers({
	locationName: function() {
		return "Unknown Location".toUpperCase();
	},
	numberOfDevices: function() {
		return this.devices.length;
	},
	isLightOn: function() {
		return properties.power ? "active" : "";
	}
});