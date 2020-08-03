var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
	username: String,
	password:String,
	profilePic:{type:String,default:"https://www.pngfind.com/pngs/m/470-4703547_icon-user-icon-hd-png-download.png"}
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);