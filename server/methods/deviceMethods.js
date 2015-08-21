Meteor.methods({
    setDeviceName: function(controlUnitId, deviceId, deviceName) {
        if (!User.isUserLoggedIn(this.userId)) {
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
        }

        if (!ControlUnitRepository.isOwner(this.userId, controlUnitId)) {
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED, "Only the owner of this device can set device access.");
        }

        if (!DeviceRepository.exists(controlUnitId, deviceId)) {
            throw new Meteor.Error(ErrorCode.DEVICE_NOT_FOUND, "No device exists with the device id '" + deviceId + "' in control unit '" + controlUnitId + "'");
        }

        console.log('setting device nmae');
        console.log(deviceName);

        DeviceRepository.setName(controlUnitId, deviceId, deviceName);
    },
    setComponentName: function(controlUnitId, deviceId, componentId, componentName) {
        if (!User.isUserLoggedIn(this.userId)) {
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED);
        }

        if (!ControlUnitRepository.isOwner(this.userId, controlUnitId)) {
            throw new Meteor.Error(ErrorCode.UNAUTHORIZED, "Only the owner of this device can set device access.");
        }

        if (!DeviceRepository.exists(controlUnitId, deviceId)) {
            throw new Meteor.Error(ErrorCode.DEVICE_NOT_FOUND, "No device exists with the device id '" + deviceId + "' in control unit '" + controlUnitId + "'");
        }

        ComponentRepository.setName(controlUnitId, deviceId, componentId, componentName);
    }
});