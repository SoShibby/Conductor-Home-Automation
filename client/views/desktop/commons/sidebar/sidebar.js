angular.module('homeautomation').
directive('sidebar', function() {
    return {
        restrict: 'E',
        templateUrl: "client/views/desktop/commons/sidebar/sidebar.ng.html",
        scope: {
            title: '@',
            items: '=',
            fetchItemDescription: '=',
            selected: '='
        },
        controller: ['$scope', function($scope) {
            $scope.selectItem = function(item) {
                $scope.selected(item);
                $scope.selectedItem = item;
            }

            if ($scope.items.length > 0) {
                $scope.selectedItem = $scope.items[0];
                $scope.selected($scope.selectedItem);
            }
        }]
    }
});