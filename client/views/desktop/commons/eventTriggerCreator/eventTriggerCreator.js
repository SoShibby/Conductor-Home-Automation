angular.module('homeautomation')
    .controller('eventTriggerCreator', ['$scope', '$stateParams', '$meteor', 'ModalService', 'close',
        function($scope, $stateParams, $meteor, ModalService, close) {
            $scope.close = close;
            $scope.triggers = [];
            $scope.actions = [];

            $scope.createTrigger = function() {
                ModalService.showModal({
                    templateUrl: "client/views/desktop/commons/eventTriggerCreator/createTrigger/createTrigger.ng.html",
                    controller: "createTrigger",
                }).then(function(modal) {
                    modal.close.then(function(triggers) {
                        $scope.triggers = $scope.triggers.concat(triggers);
                    });
                });
            }

            $scope.createAction = function() {
                ModalService.showModal({
                    templateUrl: "client/views/desktop/commons/eventTriggerCreator/createAction/createAction.ng.html",
                    controller: "createAction",
                }).then(function(modal) {
                    modal.close.then(function(actions) {
                        $scope.actions = $scope.actions.concat(actions);
                    });
                });
            }

            $scope.save = function() {
                var triggers = _.map($scope.triggers, function(trigger) {
                    delete trigger['$$hashKey'];
                    return trigger;
                });

                var actions = _.map($scope.actions, function(action) {
                    delete action['$$hashKey'];
                    return action;
                })

                $meteor.call('addTriggerAction', 'No name', triggers, actions).then(
                    function(response) {
                        alert('Successfully added new trigger - action.');
                        close();
                    },
                    function(error) {
                        alert('An error occured while adding trigger - action. The error was: ' + error);
                    });
            }
        }
    ]);