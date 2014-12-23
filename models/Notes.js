var mongoose = require('mongoose');

var NoteSchema = new mongoose.Schema({
  note: String,
  date: Number,
  dateString: String,
  friend: { type: mongoose.Schema.Types.ObjectId, ref: 'Friends' }
});

NoteSchema.methods.upvote = function(cb){
	this.upvotes += 1;
	this.save(cb);
}

module.exports = mongoose.model('Note', NoteSchema);