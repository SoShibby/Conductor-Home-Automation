Assert = (function() {
	function isString(variable, errorMessage){
		if(typeof variable !== "string"){
            throw new Meteor.Error(ErrorCode.ASSERTION_FAILED, errorMessage);
		}
	}
	
	function isInt(variable, errorMessage){
		if(!(typeof variable == "number" && isFinite(variable) && variable%1===0)){
            throw new Meteor.Error(ErrorCode.ASSERTION_FAILED, errorMessage);
		}
	}
	
    function isFloat(variable, errorMessage){
        if(!(typeof variable == "number" && variable%1!==0)){
            throw new Meteor.Error(ErrorCode.ASSERTION_FAILED, errorMessage);
		}
    }
    
	function isBoolean(variable, errorMessage){
		if(!(typeof variable == "boolean")){
            throw new Meteor.Error(ErrorCode.ASSERTION_FAILED, errorMessage);
		}
	}
	
	function isArray(variable, errorMessage){
		if(typeof variable !== "array"){
            throw new Meteor.Error(ErrorCode.ASSERTION_FAILED, errorMessage);
		}
	}
	
	function isObject(variable, errorMessage){
		if(typeof variable !== "object"){
            throw new Meteor.Error(ErrorCode.ASSERTION_FAILED, errorMessage);			
		}
	}
	
	function isDefined(variable, errorMessage){
		if(variable === undefined){
            throw new Meteor.Error(ErrorCode.ASSERTION_FAILED, errorMessage);
		}
	}
	
	function isNotEmptyString(variable, errorMessage){
		if(typeof variable !== "string" || variable.length === 0){
            throw new Meteor.Error(ErrorCode.ASSERTION_FAILED, errorMessage);			
		}
	}
	
	function isURL(variable, errorMessage){
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
			
		if(!pattern.test(variable)){
            throw new Meteor.Error(ErrorCode.ASSERTION_FAILED, errorMessage);
		}
	}
	
	function validEmail(variable, errorMessage){
		var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
		if(!pattern.test(variable)){
            throw new Meteor.Error(ErrorCode.ASSERTION_FAILED, errorMessage);
		}
	}
	
	function isJSON(variable, errorMessage){
		if(variable.constructor !== [].constructor && variable.constructor !== {}.constructor) {
            throw new Meteor.Error(ErrorCode.ASSERTION_FAILED, errorMessage);
		}
	}
  
	//Return public functions
	return {
		isString: isString,
		isInt: isInt,
        isFloat: isFloat,
		isBoolean: isBoolean,
		isArray: isArray,
		isObject: isObject,
		isDefined: isDefined,
		isNotEmptyString: isNotEmptyString,
		isURL:isURL,
		validEmail:validEmail,
		isJSON: isJSON
	}
}());

