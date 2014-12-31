var mongoose = require('mongoose');

var NoteSchema = new mongoose.Schema({
  user: String,
  note: String,
  date: Number,
  dateString: String,
  friend: String
});

NoteSchema.methods.upvote = function(cb){
	this.upvotes += 1;
	this.save(cb);
}

module.exports = mongoose.model('Note', NoteSchema);