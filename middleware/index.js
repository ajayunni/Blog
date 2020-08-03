var Blog = require("../models/blog");
var flash = require("connect-flash");
var Comment = require("../models/comments")
var middleWareObj = {};
middleWareObj.checkUserComment = function(req,res,next){
	if(req.isAuthenticated){
		Comment.findById(req.params.comment_id,function(err,comment){
			if(err){
				req.flash("error","Not Valid");
				res.redirect("back");
			}
			else{
				if(comment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","Not Valid");
					res.redirect("back");
				}
			}
		});
	}else res.redirect("back");
}

middleWareObj.checkUserBlogPost = function(req,res,next){
	if(req.isAuthenticated){
		Blog.findById(req.params.id,function(err,post){
			if(err){
				req.flash("error","Not Valid");
				res.redirect("back");
			}
			else{
				if(post.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","Not Valid");
					res.redirect("back");
				}
			}
		});
	}else res.redirect("back");
}

middleWareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated())return next();
	else{
		 req.flash("error","Please Login First");
		 res.redirect("/login");
	}
}

module.exports = middleWareObj;

