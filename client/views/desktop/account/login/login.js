angular.module('homeautomation')
    .controller('login', ['$scope', '$state', '$meteor',
        function($scope, $state, $meteor) {
            $scope.doLogin = function(credentials) {
                $meteor.loginWithPassword(credentials.email, credentials.password).then(
                    function(data) {
                        $state.go('dashboard');
                    },
                    function(error) {
                        $scope.errorMessage = 'Login error - ' + error;
                    });
            };
        }
    ]);