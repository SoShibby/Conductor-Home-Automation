angular.module('homeautomation')
    .controller('notifications', ['$scope', '$stateParams', '$meteor', 'close',
        function($scope, $stateParams, $meteor, close) {
            $scope.close = close;

            $scope.notifications = [{
                description: "Overall temperature has been automatically risen to 23°C",
                date: 1427919995000
            }, {
                description: "The washing machine was left on while nobody was home",
                date: 1420143995000
            }, {
                description: "Dishwasher has finished the cycle",
                date: 1417465595000
            }];
        }
    ]);