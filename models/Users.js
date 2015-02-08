var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	userName: String,
	friends: [String],
	googleId: {
		id: String,
		token: String,
		email: String,
		name: String},
	eventsLiked: [],
	eventsAttending: []
});

module.exports = mongoose.model('User', UserSchema);	