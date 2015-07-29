/**
 * HeartbeatManager is used for setting control units as online or offline (connected to the server or not).
 * Setting a control unit as online is done by calling the heartbeat function with the id of the control unit.
 * A control unit must receive a heartbeat at least every 30 seconds or the control unit will be automatically
 * set as offline.
 */
HeartbeatManager = (function() {

    //Check if any control units are disconnected, if that is the case then set them as disconnected
    setInterval(function(){
        Fiber(function() {
            checkHeartbeats();
        }).run();
    }, 30000);

    /**
     * Checks if any control units haven't received a heartbeat in the last 30 seconds,
     * if that is the case then those control units will be set as offline.
     */
    function checkHeartbeats() {
        var timeoutInSeconds = 31;
        var date = new Date();
        date.setSeconds(date.getSeconds() + timeoutInSeconds);

        ControlUnits.update({
                                "connection.lastHeartbeat": {
                                                                $lt: date
                                                            }
                            },
                            {
                                $set: {
                                    "connection.isConnected": false
                                }
                            },
                            {
                                multi: true
                            });
    }

    /**
     * Send a heartbeat to a control unit, this will set the control unit as online.
     * A control unit must receive a heartbeat at least every 30 seconds or the control unit
     * will be set as offline.
     *
     * @param controlUnitId  the id of the control unit that is to receive the heartbeat
     */
    function heartbeat(controlUnitId) {
        Assert.isString(controlUnitId, "Parameter controlUnitId must be a string");

        ControlUnits.update({
                                controlUnitId: controlUnitId
                            },
                            {
                                $set: {
                                    "connection.isConnected": true,
                                    "connection.lastHeartbeat": new Date()
                                }
                            });
    }

    //return public functions
    return {
        heartbeat: heartbeat
    }
}());