var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	userName: String,
	friends: [String],
	googleId: {
		id: String,
		token: String,
		email: String,
		name: String},
	pocketId:{
		username: {type: String, default: "None"},
		accessToken: String
	}
});

module.exports = mongoose.model('User', UserSchema);	