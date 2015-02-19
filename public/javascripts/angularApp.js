var app = angular.module('flapperNews', ['ui.router', 'lumx', 'clock', 'ngTagsInput']);





app.factory('friends', ['$http', '$q', function($http, $q){
	var o = {
		events: [],
		userProfile: [],
		months: ["Jan", "Feb", "March", "April", "May", "June",
		"July", "Aug", "Sept", "Oct", "Nov", "Dec"],
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		categories: ["Club", "Off-Campus", "Recruiting", "Talk/Discussion", "University Event", "Performance"],
		colors: ["green", "red", "blue", "grey", "orange", "purple"],
		userPrefs: [],
		preferences: [
    		{ "text": "Art", isPref: false , checked: ""},
    		{ "text": "Consulting", isPref: false, checked: "" },
    		{ "text": "Dance", isPref: false, checked: "" },
    		{ "text": "Energy", isPref: false, checked: "" },
    		{ "text": "Entrepreneurship", isPref: false, checked: "" },
    		{ "text": "Faith", isPref: false, checked: "" },
    		{ "text": "Finance", isPref: false, checked: "" },
    		{ "text": "Food", isPref: false, checked: "" },
    		{ "text": "Internships", isPref: false, checked: "" },
    		{ "text": "Law", isPref: false, checked: "" },
    		{ "text": "Marketing", isPref: false, checked: "" },
    		{ "text": "Medicine", isPref: false, checked: "" },
    		{ "text": "Music" , isPref: false, checked: ""},
    		{ "text": "Nonprofit" , isPref: false, checked: ""},
    		{ "text": "Party" , isPref: false, checked: ""},
    		{ "text": "Technology", isPref: false, checked: "" },
    		{ "text": "Volunteer", isPref: false, checked: "" },
  					]
		};
	 var tags = [
    { "text": "Art" },
    { "text": "Consulting" },
    { "text": "Dance" },
    { "text": "Energy" },
    { "text": "Entrepreneurship" },
    { "text": "Faith" },
    { "text": "Finance" },
    { "text": "Food" },
    { "text": "Internships" },
    { "text": "Law" },
    { "text": "Marketing" },
    { "text": "Medicine" },
    { "text": "Music" },
    { "text": "Nonprofit" },
    { "text": "Party" },
    { "text": "Technology" },
    { "text": "Volunteer" },
  ];
  o.load = function(query){
  	var deferred = $q.defer();
  	var autoTags = [];
  	console.log(query);
  	var re = new RegExp(query, "i");
  	for (var i = 0; i < tags.length; i++){
  		if (re.test(tags[i].text)){
  			autoTags.push(tags[i]);
  		}
  	}
  	if (autoTags.length > 0){
  		console.log("YES");
  		deferred.resolve(autoTags);
  	}
  	else {
  		console.log("NO");
  	deferred.resolve(tags);
  	}
  	return deferred.promise;
  } 
	o.getAll = function(){
		return $http.get('/events').success(function(data){
			angular.copy(data, o.events);//makes UI update correctly
		});
	};

	o.getUser = function(){
		return $http.get('/user').success(function(data){
			console.log(data);
			o.userProfile.push(data);//makes UI update correctly
		});
	};

	o.test = function(suggestion){
		return $http.post('/autocomplete', suggestion).success(function(data){
			console.log(data);
		});
	};
	o.create = function(event){
		return $http.post('/events', event).success(function(data){
			console.log(data);
			o.events.push(data);
		});
	};
	o.addToCal = function(event){
		return $http.post('/addToCal', event).success(function(data){
			console.log(data);
		});
	};
	o.postUserPrefs = function(prefs){
		console.log(prefs);
		return $http.post('/userprefs', prefs).success(function(data){
			console.log(data);
		});
	}
	return o;
}]);

function sortOn(collection, name){
	collection.sort(
		function(a, b){
			if (a[name] > b[name]){
				return (1);
			}
			else return -1;
		});
};

function stringToUTC(timeString){
	console.log(timeString);
	var time = Number(timeString.substring(0, 2))*3600000;
	if (timeString.length > 4 && timeString.substring(5, 7) == "AM"){
	} 
	else if (timeString.substring(0,2) === "12"){
	} else {
		time += 12*3600000;
	}
	time += Number(timeString.substring(3, 5))*60000;
	console.log(time);
	return time;
};


app.controller('MainCtrl', [
	'$scope', 'friends', 'LxDialogService', 'LxNotificationService', '$http',
	function($scope, friends, LxDialogService, LxNotificationService, $http){//friends must be passed in
		$scope.events = friends.events;
		$scope.showEvent = false;
		$scope.dialog = {};
		$scope.isShowPreference = false;
		var category = {};
		var name = friends.userProfile[0].googleId.name.split(" ");
		$scope.category = "Choose Category";
		$scope.tags = [];
		$scope.prefGroups = [];
		$scope.user = name[0];
		$scope.loadItems = function(query){
			return friends.load(query);
		};
		friends.userPrefs = friends.preferences;
		$scope.showPreferences= function(){
			$scope.isShowPreference = !$scope.isShowPreference;
		}
		$scope.groupBy = function(attribute){
			$scope.groups = [];
			//sortOn($scope.events, attribute);
			var groupValue = "_INVALID_GROUP_VALUE_";
			for (var i = 0; i < $scope.events.length; i++){
				var event = $scope.events[i];
				if (event[attribute] !== groupValue){
					var dateSplit = event[attribute].split(",");
					var group = {
						label: event[attribute],
						day: dateSplit[0],
						date: dateSplit[1],
						events: []
					};
					groupValue = group.label;
					$scope.groups.push(group);
				}
				group.events.push(event);
			}
		};

		$scope.changePreference = function(categoryString){
			for (var i = 0; i < friends.userPrefs.length; i++){
				if (friends.userPrefs[i].text === categoryString){
					if (friends.userPrefs[i].checked.length > 0){
						friends.userPrefs[i].checked = "";
					}
					else {
						friends.userPrefs[i].checked = "checked";
					}
					friends.userPrefs[i].isPref = !friends.userPrefs[i].isPref;
					break;
				}
			}
		}
		$scope.confirmPreferences = function(){
			friends.postUserPrefs(friends.userPrefs);
		}
		$scope.groupBy('eventDisplay');
		$scope.setCategory = function(number){
			category.color = friends.colors[number];
			category.name = friends.categories[number];
			$scope.category = category.name;
		};
		$scope.loadPreferences = function(){
			var n = friends.preferences.length;
			var prefGroups = [];
			var individualPrefs = [];
			for (var i = 0; i < n; i++){
				if (i != 4)	individualPrefs.push(friends.preferences[i]);
				if ((i)%4 == 0 && i != 0){
					prefGroups.push(individualPrefs);
					if (i == 4) individualPrefs.push(friends.preferences[i]);
					individualPrefs = [];
				}
				else if (i === n-1 && individualPrefs.length != 0){
				}
				else {
				}
			}
			$scope.prefGroups = prefGroups;
		};
		$scope.loadPreferences();
		$scope.addToCal = function(event){
			friends.addToCal(event);
			LxNotificationService.notify('Added to your GCal!');
		};
		$scope.setDialog = function(event){

			$scope.dialog.Title = event.eventName;
			$scope.dialog.Date = event.eventDisplay;
			$scope.dialog.Description = event.eventDescription;
			$scope.dialog.Host = event.eventHost;
			$scope.dialog.fullEvent = event;
			if(event.tags){
				$scope.dialog.Tags = event.tags;
			}
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
			//$scope.eventName = "";
			//$scope.eventHost = "";
			//$scope.eventDescription = "";
			$scope.category = "CATEGORY";
		};
		$scope.addNewEvent = function(){
			//Find the time
			if(!$scope.eventName || !$scope.eventHost || ($scope.category === "CATEGORY")  
				|| !$scope.startTime || !$scope.endTime || !$scope.startTime || !$scope.eventDate)
				{
					$scope.submissionError = "Missing a required field";
					return;
				}
				$scope.submissionError = "";
			var timeStart = stringToUTC($scope.startTime);
			console.log($scope.startTime);
			var timeEnd = stringToUTC($scope.endTime);
			console.log(timeStart);
			//Find the date
			var newDate = new Date($scope.eventDate);
			var eventString = friends.days[newDate.getDay()] + ", ";
			eventString += friends.months[newDate.getMonth()] + " " + newDate.getDate();
			var tagArray = [];
			for (var i = 0; i < $scope.tags.length; i++){
				tagArray.push($scope.tags[i].text);
			}


			//Create Event
			friends.create({
				eventName: $scope.eventName,
				eventHost: $scope.eventHost,
				eventDescription: $scope.eventDescription,
				eventUTC: (newDate.getTime()+timeStart),
				eventDisplay: eventString,
				category: category.name,
				categoryColor: category.color,
				startTimeString: $scope.startTime,
				endTimeString: $scope.endTime,
				tags: tagArray,
				eventStartUTC: (newDate.getTime()+timeStart),
				eventEndUTC: (newDate.getTime()+timeEnd)
			});
			$scope.clearEventForm();
			$scope.showEventForm();
			LxNotificationService.info('Event Submitted for Review!');
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

app.controller('landCtrl', ['$scope', 'friends', function($scope, friends){
	$scope.test = function(){
		console.log("HERE");
		friends.test();
	};
}]);
app.config(['$httpProvider','$stateProvider', '$urlRouterProvider', 
	function($httpProvider,$stateProvider, $urlRouterProvider){

		
		$stateProvider.state('home',{
			url: '/home', 
			templateUrl: '/home.html',
			controller: 'MainCtrl', //initializes with this ctrl, no need to specify earlier
			resolve: {
				postPromise: ['friends', function(friends){
					return friends.getAll();
				}],
				userPromise: ['friends', function(friends){
					return friends.getUser();
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
