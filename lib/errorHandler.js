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
        }
        
        return "Unknown error code.";
    }
}