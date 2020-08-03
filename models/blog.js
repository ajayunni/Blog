var mongoose = require("mongoose");
//Schemas 
var blogSchema = new mongoose.Schema({
	profilePic:{type:String,default:"https://www.pngfind.com/pngs/m/470-4703547_icon-user-icon-hd-png-download.png"},
	title:String,
	image:String,
	body:String,
	likes:{
      id: [
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Like"
		}
	],
      number: {type:Number,default:0}
   },
	created:{type:Date,default:Date.now},
	author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
});
//compile it to the model
module.exports = mongoose.model("Blog",blogSchema);