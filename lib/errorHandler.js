ErrorHandler = {
    getErrorMessage: function(errorCode){
        switch(errorCode){
            case ErrorCode.UNAUTHORIZED:
                return "You must be logged in.";
            case ErrorCode.EMAIL_ALREADY_IN_USE:
                return "The email you entered is already in use.";
            case ErrorCode.INVALID_EMAIL_ADDRESS:
                return "The email you entered is not valid.";
            case ErrorCode.INVALID_FIRST_NAME:
                return "Invalid first name, first name can't be empty";
            case ErrorCode.INVALID_LAST_NAME:
                return "Invalid last name, last name can't be empty";
            case ErrorCode.INTERNAL_ERROR:
                return "Internal error occured.";
            case ErrorCode.ASSERTION_FAILED:
                return "Assertion failed, please contact support.";
            case ErrorCode.INVALID_API_KEY:
                return "Invalid API key.";
            case ErrorCode.DEVICE_ALREADY_EXIST:
                return "Unable to add device, a device already exist with the same id.";
            case ErrorCode.COMPONENT_ALREADY_EXIST:
                return "Unable to add device component, a device component already exist with the same id.";
            case ErrorCode.INVALID_DATA_SUPPLIED:
                return "Unable to perform action, the data supplied is invalid.";
            case ErrorCode.DEVICE_NOT_FOUND:
                return "No device was found with the supplied data.";
            case ErrorCode.FRIEND_NOT_FOUND:
                return "No friend was found.";
            case ErrorCode.USER_ALREADY_HAS_DEVICE_ACCESS:
                return "User already has access to the device.";
            case ErrorCode.INVALID_DEVICE_ACCESS:
                return "User don't have access to the device.";
        }

        return "Unknown error code.";
    }
}