var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
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
	tags: []


});



module.exports = mongoose.model('Events', EventSchema);