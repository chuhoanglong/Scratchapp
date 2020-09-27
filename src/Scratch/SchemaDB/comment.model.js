var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    avatar: String,
    comment: String,
    name: String,
    userId: String,
    rId: String,
    cmtId: String,
});

var Comment = mongoose.model("comments", CommentSchema, "comments");
module.exports = Comment;