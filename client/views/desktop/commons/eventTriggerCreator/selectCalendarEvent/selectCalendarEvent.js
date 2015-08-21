angular.module('homeautomation')
    .controller('selectCalendarEvent', ['$scope', '$stateParams', '$meteor', 'close',
        function($scope, $stateParams, $meteor, close) {
            $scope.close = close;
            $scope.options = {
                triggerType: 'calendarEvent',
                timeOffset: 0
            }
        }
    ]);