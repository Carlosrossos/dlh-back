const mongoose = require("mongoose");

const photos = mongoose.Schema({
    url: String,
    author: String,
});

const poiSchema = mongoose.Schema({
  name: String,
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  desc: String,
  type: String,
  favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  isPublic: Boolean,
  photos: [photos],
});

const Poi = mongoose.model("pois", poiSchema);

module.exports = Poi;
