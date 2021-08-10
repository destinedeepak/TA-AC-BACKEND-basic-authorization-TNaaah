var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var podcastSchema = new Schema({
  title: { type: String, required: true },
  artist:{type: String, required: true},
  releasedDate: { type: Date },
  category: {type: String, required: true},
  audioFile : {type: String},
  imageFile : {type: String},
  description: {type: String}
});

module.exports = mongoose.model('Podcast', podcastSchema);
