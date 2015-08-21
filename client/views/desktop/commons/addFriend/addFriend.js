angular.module('homeautomation')
    .controller('addFriend', ['$scope', '$stateParams', '$meteor', 'close',
        function($scope, $stateParams, $meteor, close) {
            $scope.close = close;

            $scope.addFriend = function(email) {
                $meteor.call('addFriend', email).then(
                    function(response) {
                        alert('Friend added successfully!');
                    },
                    function(error) {
                        alert('Failed to add a new friend. The error was: ' + error);
                    })
            }
        }
    ]);