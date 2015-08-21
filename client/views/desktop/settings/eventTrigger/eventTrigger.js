angular.module('homeautomation')
    .controller('eventTriggerSettings', ['$scope', '$stateParams', '$meteor', 'ModalService',
        function($scope, $stateParams, $meteor, ModalService) {
            $scope.triggerActions = $meteor.collection(TriggerActions);

            $scope.add = function() {
                ModalService.showModal({
                    templateUrl: "client/views/desktop/commons/eventTriggerCreator/eventTriggerCreator.ng.html",
                    controller: "eventTriggerCreator",
                });
            }

            $scope.remove = function(triggerAction) {
                $meteor.call('removeTriggerAction', triggerAction._id).then(
                    function(data) {

                    },
                    function(error) {
                        alert('An error occurred when removing trigger action, the error was: ', error);
                    });
            }
        }
    ]);