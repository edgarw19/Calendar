var mongoose = require('mongoose');

var testEventSchema = new mongoose.Schema({
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
	eventEndUTC: Number


});



module.exports = mongoose.model('testEvent', testEventSchema);