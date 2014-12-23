var mongoose = require('mongoose');

var FriendSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	updateFrequency: Number,
	emailAddress: String,
	pastInteraction: [],
	lastTime: Date,
	notes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}]

});

FriendSchema.methods.updateLastAccess = function(cb){
	this.lastTime = new Date();
	this.save(cb);
}



module.exports = mongoose.model('Friends', FriendSchema);