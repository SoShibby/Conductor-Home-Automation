var Messages = new Mongo.Collection(null);

MessageBox = {
    displayInfo: function(title, description) {
        Messages.insert({
            title: title,
            description: description,
            type: 'info'
        });
    },
    displayError: function(title, message) {
        Messages.insert({
            title: title,
            description: description,
            type: 'error'
        });
    }
}

angular.module('homeautomation')
    .controller('messageBoxHandler', ['$scope', '$stateParams', '$meteor', 'close',
        function($scope, $stateParams, $meteor, close) {
            $scope.messages = $meteor.collection(Messages);
            $scope.close = function(message) {
                Messages.remove(message._id);
            }
        }
    ]);