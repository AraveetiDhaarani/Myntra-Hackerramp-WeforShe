const mongoose = require('mongoose');

const InstagramPostSchema = new mongoose.Schema({
    hashtags: String,
    likes: Number,
    image: String
});

module.exports = mongoose.model('InstagramPost', InstagramPostSchema);
