IntervalHelper = (function() {

	function runEvery15Minutes(functionToRun){
		var d = new Date(),
        h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), (d.getMinutes() - (d.getMinutes() % 15)) + 15, 0, 0),
        e = h - d;
		
		setTimeout(function(){
			Fiber(function() {
				functionToRun();
				runEvery15Minutes(functionToRun);
			}).run();
		}, e);
	}
	
	function runEveryMinute(functionToRun){
		var seconds = new Date().getSeconds();
		var waitTime = (60 - seconds) * 1000;
		
		setTimeout(function(){
			Fiber(function() {  
				functionToRun();
				runEveryMinute(functionToRun);
			}).run(); 
		}, waitTime);
	}
	
	//Return public functions
	return {
		runEvery15Minutes: runEvery15Minutes,
		runEveryMinute: runEveryMinute
	}
}());