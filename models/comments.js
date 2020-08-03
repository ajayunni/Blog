var mongoose = require("mongoose");
var CommentSchema = mongoose.Schema({
	comment:String,
	author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
	},
	parent:String,
	replies: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
			autopopulate:true
		}
	]
});
CommentSchema.plugin(require("mongoose-autopopulate"));
module.exports = mongoose.model("Comment",CommentSchema);