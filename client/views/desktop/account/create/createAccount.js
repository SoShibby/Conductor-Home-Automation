angular.module('homeautomation')
    .controller('createAccount', ['$scope', '$state', '$meteor',
        function($scope, $state, $meteor) {
            $scope.createAccount = function(account) {
                $meteor.createUser(account).then(
                    function(data) {
                        $state.go('dashboard');
                    },
                    function(error) {
                        $scope.errorMessage = 'Create account error - ' + error;
                    });
            };
        }
    ]);