angular.module('homeautomation').
directive('eventTriggerTranslator', function() {
    return {
        restrict: 'E',
        templateUrl: "client/views/desktop/commons/eventTriggerTranslator/eventTriggerTranslator.ng.html",
        scope: {
            trigger: '=',
        },
        controller: ['$scope', '$meteor', function($scope, $meteor) {
            if($scope.trigger && $scope.trigger.controlUnitId && $scope.trigger.deviceId){
               $scope.device = Devices.findOne({
                    controlUnitId: $scope.trigger.controlUnitId,
                    id: $scope.trigger.deviceId
                });
            }

            $scope.readableTimeOffset = function(totalMinutes) {
                var str = "";

                // First make the minutes into a positive value e.g -55 minutes becomes +55 minutes
                if(totalMinutes < 0) {
                    totalMinutes *= -1;
                }

                var hours = parseInt(totalMinutes / 60);
                var minutes = totalMinutes % 60;

                if(hours > 0) {
                    str = hours + ' ' + (hours === 1 ? 'hour' : 'hours');
                }

                if(hours > 0 && minutes > 0) {
                    str += ' and ';
                }

                if(minutes > 0) {
                    str += minutes + " " + (minutes === 1 ? 'minute' : 'minutes');
                }

                return str;
            }
        }]
    }
});