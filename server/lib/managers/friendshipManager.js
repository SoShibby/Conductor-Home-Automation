/**
 * Friendship manager is a library containing help functions for creating friend request, accepting
 * friend request and declining friend requests.
 */
FriendshipManager = (function() {
	
    /**
	 * Make a new friend request.
     *
	 * @param requester  the user id of the user who is sending the request
	 * @param friend     the user id of the user who is receiving the friend request
     */
	function makeFriendRequest(requester, friend){
		if(!existsUser(requester))
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "No user exists with _id: " + requester);
		
		if(!existsUser(friend))
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "No user exists with _id: " + friend);
		
		if(areFriends(requester, friend))
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "The users are already friends");
		
		Meteor.users.update({ 
								_id: requester 
							}, 
							{ 
								$addToSet: { 
												'friends.unconfirmed': friend  
											} 
							});
							
		Meteor.users.update({ 
								_id: friend 
							}, 
							{ 
								$addToSet: { 
												'friends.requests': requester
											} 
							});
	}
	
    /**
	 * Accept a friend request
     *
	 * @param userId         the id of the user who wants to accept a friend request
	 * @param friendsUserId  the id of the friend who sent the friend request
     */
	function acceptFriendRequest(userId, friendsUserId){
		if(!existsUser(userId))
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "No user exists with _id: " + userId);
		
		if(!existsUser(friendsUserId))
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "No user exists with _id: " + friendsUserId);
			
		Meteor.users.update({ 
								_id: userId 
							}, 
							{ 
								$addToSet: { 
												'friends.confirmed': friendsUserId
											} 
							});
							
		Meteor.users.update({ 
								_id: friendsUserId 
							}, 
							{ 
								$addToSet: { 
												'friends.confirmed': userId
											} 
							});
							
		removeFriendRequest(friendsUserId, userId);
	}
	
    /**
	 * Declines a invitation to become friends
     *
	 * @param requesterId  the id of the user who sent the friend request
	 * @param requestedId  the id of the user who declines the friend request
     */
	function declineFriendRequest(requesterId, requestedId){
		removeFriendRequest(requesterId, requestedId);
	}
	
    /**
	 * Removes an open friend request
     *
	 * @param requesterId  the id of the user who sent the friend request
	 * @param requestedId  the id of the user who received the friend request
     */
	function removeFriendRequest(requesterId, requestedId){
		if(!existsUser(requesterId))
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "No user exists with _id: " + requesterId);
		
		if(!existsUser(requestedId))
			throw new Meteor.Error(ErrorCode.INTERNAL_ERROR, "No user exists with _id: " + requestedId);
			
		Meteor.users.update({ 
								_id: requesterId 
							}, 
							{ 
								$pull: { 
											'friends.unconfirmed': requestedId
										}
							});
		
		Meteor.users.update({ 
								_id: requestedId 
							}, 
							{ 
								$pull: { 
											'friends.unconfirmed': requesterId
										}
							});
							
		Meteor.users.update({ 
								_id: requestedId 
							}, 
							{ 
								$pull: { 
											'friends.requests': requesterId
										}
							});
							
		Meteor.users.update({ 
								_id: requesterId 
							}, 
							{ 
								$pull: { 
											'friends.requests': requestedId
										}
							});
	}
	
    /**
	 * Removes a friend
     *
	 * @param user1  the user id of the first user
	 * @param user2  the user id of the second user
     */
	function removeFriend(user1, user2){
		Meteor.users.update({ 
								_id: user1 
							}, 
							{ 
								$pull: { 
											'friends.confirmed': user2
										}
							});
							
		Meteor.users.update({ 
								_id: user2 
							}, 
							{ 
								$pull: { 
											'friends.confirmed': user1
										}
							});
	}
	
    /**
	 * Check if a user with a certain user id exist in the database 
     *
	 * @param userId  the id of the user of whom we want to check if he/she exist
     */
	function existsUser(userId){
		return Meteor.users.findOne({ _id: userId }) !== undefined;
	}
	
    /**
	 * Check if two users are friends or not
     *
	 * @param user1  the id of the first user
     * @param user1  the id of the second user
     */
	function areFriends(user1, user2){
		var user = Meteor.users.findOne({ 
											$and: [ 
													{ 
														_id: user1 
													}, 
													{ 
														'friends.confirmed': user2 
													}
												  ]
										});
									
		return user !== undefined;
	}
	
    //return public functions
	return {
		makeFriendRequest: makeFriendRequest,
		acceptFriendRequest: acceptFriendRequest,
		declineFriendRequest: declineFriendRequest,
		removeFriend: removeFriend,
		areFriends: areFriends
	}
}());