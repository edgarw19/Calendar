var app = angular.module('flapperNews', ['ui.router', 'lumx', 'clock', 'bootstrap-tagsinput']);





app.factory('friends', ['$http', function($http){
	var o = {
		events: [],
		months: ["Jan", "Feb", "March", "April", "May", "June",
		"July", "Aug", "Sept", "Oct", "Nov", "Dec"],
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		categories: ["Club", "Off-Campus", "Recruiting", "Talk/Discussion", "University Event"],
		colors: ["green", "red", "blue", "grey", "orange"]
	};  
	o.getAll = function(){
		return $http.get('/events').success(function(data){
			angular.copy(data, o.events);//makes UI update correctly
		});
	};
	o.create = function(event){
		return $http.post('/events', event).success(function(data){
			console.log(data);
			o.events.push(data);
		});
	};
	return o;
}]);

app.controller('MainCtrl', [
	'$scope', 'friends', 'LxDialogService', 'LxNotificationService',
	function($scope, friends, LxDialogService, LxNotificationService){//friends must be passed in
		$scope.events = friends.events;
		$scope.showEvent = false;
		$scope.dialog = {};
		$scope.extraTags = [];
		var category = {};
		$scope.category = "CATEGORY";
		$scope.setCategory = function(number){
			category.color = friends.colors[number];
			category.name = friends.categories[number];
			$scope.category = category.name;
		};
		$scope.test = function(){
			var str = "test@princeton.edu";
			var n = str.search(/@princeton.edu$/);
			console.log($scope.extraTags);
			console.log(n);
			console.log($scope.searchTerm);
		};
		$scope.setDialog = function(event){
			console.log(event);
			$scope.dialog.Title = event.eventName;
			$scope.dialog.Date = event.eventDisplay;
			$scope.dialog.Description = event.eventDescription;
			$scope.dialog.Host = event.eventHost;
			if (event.startTimeString && event.endTimeString){
			$scope.dialog.Time = event.startTimeString.substring(0, 5) + "-" + event.endTimeString;
			}
		};
		$scope.opendDialog = function(event)
		{
			$scope.setDialog(event);

			LxDialogService.open('test');
		};


		$scope.closingDialog = function()
		{

		};
		$scope.clearEventForm = function(){
			$scope.eventName = "";
			$scope.eventHost = "";
			$scope.eventDescription = "";
			$scope.category = "CATEGORY";
		};
		$scope.addNewEvent = function(){
			//Find the time
			if(!$scope.eventName || !$scope.eventHost || !$scope.eventDescription  
				|| !$scope.startTime || !$scope.endTime || !$scope.startTime)
				{
					$scope.submissionError = "Missing a required field";
					return;
				}
				$scope.submissionError = "";
			var timeString = $scope.startTime;
			var timeNumber = Number(timeString.substring(0, 2));
			if (timeString.length > 4 && timeString.substring(5, 7) == "AM"){
			} 
			else {
				timeNumber += 12;
			}
			//Find the date
			var newDate = new Date($scope.eventDate);
			var eventString = friends.days[newDate.getDay()] + ", ";
			eventString += friends.months[newDate.getMonth()] + " " + newDate.getDate();
			console.log(eventString);
			//Create Event
			friends.create({
				eventName: $scope.eventName,
				eventHost: $scope.eventHost,
				eventDescription: $scope.eventDescription,
				eventUTC: (newDate.getTime()+timeNumber),
				eventDisplay: eventString,
				category: category.name,
				categoryColor: category.color,
				startTimeString: $scope.startTime,
				endTimeString: $scope.endTime,
			});
			$scope.clearEventForm();
			$scope.showEventForm();
			LxNotificationService.notify('Event Submitted!');
		};
		$scope.showEventForm = function(){
			$scope.showEvent = !$scope.showEvent;
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
	function($scope, friend, notes, friends){
		$scope.doComment = false;
		$scope.friend = friend;
		$scope.notes = notes;
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
			console.log(notes);
			console.log(friend);
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
