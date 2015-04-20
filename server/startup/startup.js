Meteor.startup(function() {
    //Create a new communication channel for each control unit
    var controlUnits = ControlUnitRepository.getAll();
    
    for(var i = 0; i < controlUnits.length; i++){
        Stream.create(controlUnits[i].apiKey);      //Create the communication channel with the control units API key as the channel id
    }
});