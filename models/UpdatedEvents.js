var mongoose = require('mongoose');

var UpdatedEventSchema = new mongoose.Schema({
	eventName: String,
	eventHost: String,
	eventDescription: String,
	eventUTC: Number,
	eventDisplay: String,
	eventUpvotes: Number,
	eventAttendees: [],
	category: String,
	categoryColor: String,
	startTimeString: String,
	endTimeString: String,
	tags: [String],
	eventStartUTC: Number,
	eventEndUTC: Number,
	popularity: {type: Number, default: 0},
	favoritedBy: [],
	creator: String

});




module.exports = mongoose.model('UpdatedEvents', UpdatedEventSchema);