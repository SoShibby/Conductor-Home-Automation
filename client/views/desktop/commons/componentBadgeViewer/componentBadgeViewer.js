angular.module('homeautomation').
directive('componentBadgeViewer', function() {
    return {
        restrict: 'E',
        templateUrl: "client/views/desktop/commons/componentBadgeViewer/componentBadgeViewer.ng.html",
        scope: {
            components: '=',
            events: '='
        },
        controller: ['$scope', '$meteor', 'ModalService', function($scope, $meteor, ModalService) {
            $scope.events = $scope.events || {};
            $scope.events.onComponentSelected = $scope.events.onComponentSelected || {};

            $scope.showComponentDetails = function(component) {
                ModalService.showModal({
                    templateUrl: "client/views/desktop/commons/viewComponentDetails/viewComponentDetails.ng.html",
                    controller: "viewComponentDetails",
                    inputs: {
                        component: component
                    }
                });
            }
        }]
    }
});