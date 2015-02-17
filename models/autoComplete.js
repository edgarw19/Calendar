var mongoose = require('mongoose');

var autoCompleteSchema = new mongoose.Schema({
	category: String
});

module.exports = mongoose.model('AutoComplete', autoCompleteSchema);