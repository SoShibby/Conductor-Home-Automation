angular.module('homeautomation')
    .controller('dashboard', ['$scope', '$stateParams', '$meteor',
        function($scope, $stateParams, $meteor) {
            $scope.users = $meteor.collection(Meteor.users);
            $scope.selectedUser = $scope.users[0];
        }
    ]);