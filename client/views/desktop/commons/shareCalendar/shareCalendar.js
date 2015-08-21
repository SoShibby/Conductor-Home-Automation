angular.module('homeautomation')
.controller('shareCalendar', ['$scope', '$stateParams', '$meteor', 'close',
    function($scope, $stateParams, $meteor, close) {
        $scope.close = close;

        $scope.share = function() {
            $meteor.call('shareCalendar', $scope.email).then(
                function(response) {
                    alert('Calendar shared successfully!');
                },
                function(error) {
                    alert('An error occured while sharing calendar. The error was: ' + error);
                })
        }
    }
    ]);