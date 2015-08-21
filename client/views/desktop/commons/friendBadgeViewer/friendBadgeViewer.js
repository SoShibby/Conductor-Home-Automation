angular.module('homeautomation').
directive('friendBadgeViewer', function() {
    return {
        restrict: 'E',
        templateUrl: "client/views/desktop/commons/friendBadgeViewer/friendBadgeViewer.ng.html",
        scope: {
            friends: '=',
            events: '='
        },
        controller: ['$scope', '$meteor', 'ModalService', function($scope, $meteor, ModalService) {
            $scope.events = $scope.events || {};

            if(!$scope.events.onFriendClicked){
                $scope.events.onFriendClicked = function(){};
            }

            $scope.confirmedFriends = $meteor.collection(function() {
                return Meteor.users.find({
                    _id: {
                        $in: Meteor.user().friends.confirmed
                    }
                });
            });

            $scope.unconfirmedFriends = $meteor.collection(function() {
                return Meteor.users.find({
                    _id: {
                        $in: Meteor.user().friends.unconfirmed
                    }
                });
            });

            $scope.friendRequestPending = $meteor.collection(function() {
                return Meteor.users.find({
                    _id: {
                        $in: Meteor.user().friends.requests
                    }
                });
            });

            $scope.acceptFriendRequest = function(friend) {
                $meteor.call('acceptFriendRequest', friend._id).then(
                    function(response) {
                        alert('Friend request accepted.');
                    },
                    function(error) {
                        alert('An error occured while accepting friend request. The error was: ' + error);
                    });
            }

            $scope.deliceFriendRequest = function(friend) {
                $meteor.call('declineFriendRequest', friend._id).then(
                    function(response) {},
                    function(error) {
                        alert('An error occured while declining friend request. The error was: ' + error);
                    });
            }

            $scope.addFriend = function(friend) {
                ModalService.showModal({
                    templateUrl: "client/views/desktop/commons/addFriend/addFriend.ng.html",
                    controller: "addFriend",
                });
            }

            $scope.removeFriend = function(friend) {
                $meteor.call('removeFriend', friend._id).then(
                    function(response) {
                        alert('Friend removed successfully!');
                    },
                    function(error) {
                        alert('An error occured while removing friend. The error was: ' + error);
                    });
            }

            $scope.removeUnconfirmedFriend = function(friend) {
                $meteor.call('removeUnconfirmedFriend', friend._id).then(
                    function(response) {
                        alert('Friend removed successfully!');
                    },
                    function(error) {
                        alert('An error occured while removing friend. The error was ' + error);
                    });
            }
        }]
    }
});