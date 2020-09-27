var mongoose = require('mongoose');

var homeSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    directions: Array,
    ingredients: Array,
    name: String,
    like: Number,
    usersLike: Array,
    rId: String,
    profileAvatar: String,
    profileName: String,
    uId: {
        type: String,
        required: true
    },
    urlCover: String
});

var Home = mongoose.model("recipes", homeSchema, "recipes");

module.exports = Home;