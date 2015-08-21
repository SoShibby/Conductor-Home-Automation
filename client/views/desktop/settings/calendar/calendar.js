angular.module('homeautomation')
    .controller('calendarSettings', ['$scope', '$stateParams', '$meteor', 'ModalService',
        function($scope, $stateParams, $meteor, ModalService) {
            $scope.feed = $meteor.object(Feeds, {});

            $scope.shareCalendar = function() {
                ModalService.showModal({
                    templateUrl: "client/views/desktop/commons/shareCalendar/shareCalendar.ng.html",
                    controller: "shareCalendar",
                });
            }

            $scope.refreshEvents = function() {
                $meteor.call('refreshEvents').then(
                    function(response) {
                        alert('Events refreshed successfully.');
                    },
                    function(error) {
                        alert('An error occured while refreshing calendar events. The error was: ' + error);
                    });
            }
        }
    ]);