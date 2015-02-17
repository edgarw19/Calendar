var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	userName: String,
	googleId: {
		id: String,
		token: String,
		refreshToken: String,
		email: String,
		name: String},
	eventsAdded: [],
	eventPreferences: [],
	googleCal: []
});

module.exports = mongoose.model('User', UserSchema);	