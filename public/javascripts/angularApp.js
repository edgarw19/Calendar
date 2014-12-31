var app = angular.module('flapperNews', ['ui.router']);

app.factory('friends', ['$http', function($http){
	var o = {
		friends: [],
		months: ["Jan", "Feb", "March", "April", "May", "June",
		"July", "Aug", "Sept", "Oct", "Nov", "Dec"]
	};

	o.getAll = function(){
		return $http.get('/friends').success(function(data){
			angular.copy(data, o.friends);//makes UI update correctly
		});
	};
	o.create = function(friend){
		return $http.post('/friends', friend).success(function(data){
			o.friends.push(data);
		});
	};
	o.upvote = function(post){
		return $http.put('/friends/' + post._id + '/upvote').success(function(data){
			post.upvotes += 1;
		});
	};
	o.downvote = function(post){
		return $http.put('/friends/' + post._id + '/downvote').success(function(data){
			post.upvotes -= 1;
		});
	};
	o.get = function(id){
		return $http.get('/friends/' + id).then(function(res){
			return res.data;
		});
	};

	o.getNotes = function(id){
		return $http.get('/friends/' + id + '/notes').then(function(res){
			console.log(res.data);
			return res.data;
		});
	};


	o.addNote = function(id, note){
		return $http.post('/friends/'+id+'/notes', note);
	};

	o.deleteNote = function(id, note){
		console.log(note);
		return $http.delete('/friends/'+id+'/notes/'+note._id);
	};

	o.grabPocketToken = function(){
		return $http.get('/user/pocketToken').success(function(res){
				console.log(res.data);
		});
	};

	o.test = function(){
		return $http.get('/test');
	}
	return o;
}]);

app.controller('MainCtrl', [
	'$scope', 'friends',
	function($scope, friends){//friends must be passed in
		$scope.friends = friends.friends;
		$scope.grabPocket = function(){
			console.log("grab pocket start here");
			var answer = friends.grabPocketToken();
			console.log(answer);
		};
		$scope.test = function(){
			console.log("HERE");
			friends.test();
		};
		$scope.addFriend = function(){
			console.log($scope);
			console.log($scope.frequency);
			if(!$scope.firstName || !$scope.lastName || !$scope.emailAddress || !$scope.frequency){return;}
			friends.create({
				firstName: $scope.firstName,
				lastName: $scope.lastName,
				emailAddress: $scope.emailAddress,
				updateFrequency: $scope.frequency,
				lastTime: new Date()
			});
			$scope.firstName = '';
			$scope.lastName = '';
			$scope.emailAddress = '';
		};
		$scope.incrementUpvotes = function(post){
			console.log(post.comments.length);
			friends.upvote(post);
		};
		$scope.decrementUpvotes = function(post){
			friends.downvote(post);
		};
	}]);

// app.controller('friendsCtrl', ['$scope', '$stateParams', 'friends',
// 	function($scope, $stateParams, friends){
// 		$scope.post = friends.friends[$stateParams.id];
// 		$scope.addComment = function(){
// 			if($scope.body === ''){return;}
// 			$scope.post.comments.push({
// 				body: $scope.body,
// 				author: 'user',
// 				upvotes: 0
// 			});
// 			$scope.body = '';
// 		}
// 	}]);

// app.controller('friendsCtrl', ['$scope', 'post', 'friends',
// 	function($scope, post, friends){
// 		$scope.post = post;
// 		$scope.addComment = function(){
// 			if($scope.body === ''){return;}
// 			friends.add
// 			$scope.post.comments.push({
// 				body: $scope.body,
// 				author: 'user',
// 				upvotes: 0
// 			});
// 			$scope.body = '';
// 		}
// 	
app.controller('friendsCtrl', ['$scope', 'friend', 'notes', 'friends',
	function($scope, friend, friends, notes){
		$scope.doComment = false;
		$scope.friend = friend;
		console.log(friend);
		$scope.notes = notes;
		console.log(notes);
		for (var i = 0; i < $scope.notes.length; i++){
			console.log($scope.notes[i]);
		};
		$scope.test = function(){
			friends.test();
		};
		$scope.addNotes = function(){
			if($scope.note === ''){return;}
			var curDate = new Date();
			var _dateString = "" + friends.months[curDate.getMonth()] +"-" + curDate.getFullYear();
			var newNote = {
				note: $scope.note,
				date: curDate.getTime(),
				dateString: _dateString
			};
			friends.addNote(friend._id, newNote).success(function(note){
				newNote._id = note._id;
				$scope.notes.push(newNote);
			});
			$scope.note = '';
		};
		$scope.deleteNote = function(note, index){
			console.log(note);
			console.log("delete");
			//friends.deleteNote(friend._id, note);
			$scope.notes.splice(index, 1);
		};

		$scope.showComment = function(){
			$scope.doComment = !$scope.doComment;
		};
	}]);

app.controller('landCtrl', ['$scope', 'friends', function($scope, friends){
	$scope.test = function(){
		console.log("HERE");
		friends.test();
	};
}]);
app.config(['$httpProvider','$stateProvider', '$urlRouterProvider', 
	function($httpProvider,$stateProvider, $urlRouterProvider){

		$httpProvider.defaults.useXDomain = true;
		$httpProvider.defaults.withCredentials = true;
		delete $httpProvider.defaults.headers.common["X-Requested-With"];
		$httpProvider.defaults.headers.common["Accept"] = "application/json";
		$httpProvider.defaults.headers.common["Content-Type"] = "application/json";
		$stateProvider.state('home',{
			url: '/home', 
			templateUrl: '/home.html',
			controller: 'MainCtrl', //initializes with this ctrl, no need to specify earlier
			resolve: {
				postPromise: ['friends', function(friends){
					return friends.getAll();
				}]
			}
		});
		$stateProvider.state('friends', {
			url: '/friends/{id}',
			templateUrl: '/friends.html',
			controller: 'friendsCtrl',
			resolve: {
				friend: ['$stateParams', 'friends', function($stateParams, friends){
					return friends.get($stateParams.id);
				}],
				notes: ['$stateParams', 'friends', function($stateParams, friends){
					return friends.getNotes($stateParams.id);
				}]
			}
		});
		$stateProvider.state('landing', {
			url: '/landing',
			templateUrl: '/landing.html',
			controller: 'MainCtrl',
		});
		$urlRouterProvider.otherwise('home');//otherwise go here
	}]);

function signinCallback(authResult) {
	if (authResult['status']['signed_in']) {
		console.log(authResult);
    // Update the app to reflect a signed in user
    // Hide the sign-in button now that the user is authorized, for example:
    document.getElementById('signinButton').setAttribute('style', 'display: none');
} else {
    // Update the app to reflect a signed out user
    // Possible error values:
    //   "user_signed_out" - User is signed-out
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    console.log('Sign-in state: ' + authResult['error']);
}
}
