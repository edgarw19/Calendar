var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	userName: String,
	googleId: {
		id: String,
		token: String,
		refreshToken: String,
		email: String,
		name: String,
		lastTime: Date},
	upvotes: Number,
	pocketId:{
		username: String,
		accessToken: String
	}
});

mongoose.model('UserModel', UserSchema);
