angular.module('homeautomation').
directive('header', function() {
    return {
        restrict: 'A',
        templateUrl: "client/layouts/desktop/header.ng.html",
        scope: {},
        controller: ['$scope', '$interval', 'ModalService', function($scope, $interval, ModalService) {
            $interval(function() {
                $scope.time = moment().format('hh:mmA');
                $scope.date = moment().format('M MMMM YYYY');
            }, 1000);

            $scope.showNotifications = function() {
                console.log('show notifications');

                ModalService.showModal({
                    templateUrl: 'client/views/desktop/commons/notifications/notifications.ng.html',
                    controller: 'notifications',
                }).then(function(modal) {
                    modal.close.then(function() {

                    });
                });
            }
        }]
    }
});