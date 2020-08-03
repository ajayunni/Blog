var mongoose = require("mongoose"),
	express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	expressSanitizier =  require("express-sanitizer"),
	Blog = require("./models/blog"),
	seedDB = require("./seed")
	Comment = require("./models/comments"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user"),
	methodOverride = require("method-override"),
	middleWare = require("./middleware"),
	flash = require("connect-flash");

app.use(require("express-session")({
	secret:"logged in",
	resave:false,
	saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride("_method"));

// seedDB();

//middleware to check whether the user is logged in or not
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();	
});

//connect mongoose for backend!
mongoose.connect("mongodb://localhost/blog", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
mongoose.set('useFindAndModify', false);
//for using put request
app.use(methodOverride("_method"));

// for html codes
app.set("view engine","ejs");

// for css files
app.use(express.static("public"));

// for turning strings to js objects!
app.use(bodyParser.urlencoded({extended: true}));

//to prevent injecting js code in post as html
app.use(expressSanitizier());


//Routes
//home page
app.get("/",function(req,res){
	res.redirect("blogs");
});
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blog){
		if(err)console.log("could not find blog");
		else res.render("blogs",{blog:blog,currentUser:req.user});
	});
});
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id).populate("comments").exec(function(err,blog){
		if(err)res.redirect("blog/blogs");
		else res.render("show",{blog:blog,user:req.user});
	});
});
app.get("/new",middleWare.isLoggedIn,function(req,res){
	res.render("new");
});
app.get("/latest",function(req,res){
	res.render("latest/latest");
});
app.get("/gallery",function(req,res){
	rbloes.render("gallery/gallery");
});

//create a blog post
app.post("/blogs",function(req,res){
	var description = req.sanitize(req.body.blog.body);
	var title = req.body.blog.title;
    var image = req.body.blog.image;
    var desc = description;
	var profilePic = req.user.profilePic;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var blogPost = {title: title, image: image, body: desc, author:author,profilePic:profilePic}
	Blog.create(blogPost,function(err,blog){
		if(err)res.redirect("new");
		else{
			req.flash("success","Post created👌");
			res.redirect("blogs");
		}
	});
});

app.get("/register",function(req,res){
	res.render("register");
})

app.post("/register",function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
			if(err){
				req.flash("error","oops!! Username already taken 😓");
				return res.redirect("/register");
			}
        	passport.authenticate("local")(req, res, function(){
			req.flash("success","Welcome "+req.body.username+" 🥳🎈");
            res.redirect("/blogs"); 
        });
    });
});

app.get("/login",function(req,res){
	res.render("login",{message:req.flash("error")});
})


app.get("/profile",middleWare.isLoggedIn,function(req,res){
	res.render("profile",{user:req.user});
})

app.put("/profile",middleWare.isLoggedIn,function(req,res){
	console.log(req.user.profilePic+" "+req.body.profile.image);
	User.findByIdAndUpdate(req.user._id,req.body.profile,function(err,userFound){
		if(!err){
			req.flash("success","done ✔");
			console.log(req.user.profilePic);
			res.redirect("/profile");
		}
	});
})

app.post("/login", function (req, res, next) {
	passport.authenticate("local",
	{
		successRedirect: "/blogs",
		failureRedirect: "/login",
		failureFlash: true,
		successFlash: "Welcome Back, " + req.body.username + " 🤗!"
	})(req, res);
});								 

app.get("/logout", function(req, res){
   req.logout();
   req.flash("success","See you soon!");
   res.redirect("/blogs");
});

//for editing the blog posts
app.get("/blogs/:id/edit",middleWare.isLoggedIn,middleWare.checkUserBlogPost,function(req,res){
	Blog.findById(req.params.id,function(err,post){
		res.render("edit",{post:post});
	});
});

//for new comments
app.get("/blogs/:id/comments/new",middleWare.isLoggedIn,function(req,res){
	Blog.findById(req.params.id,function(err,post){
		if(err)res.redirect("blogs");
		else{
			res.render("comments/new",{id:req.params.id});
		}
	});
});
//like a blog post
app.post("/blogs/:id/likes",middleWare.isLoggedIn,function(req,res){
	Blog.findById(req.params.id,function(err,post){
		if(!err){
			if(!post.likes.id.includes(req.user._id)){
				post.likes.id.push(req.user._id);
				post.likes.number++;
			}
			post.save();
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//post the comments
app.post("/blogs/:id/comments",middleWare.isLoggedIn,function(req,res){
	Blog.findById(req.params.id,function(err,post){
		if(!err){
			Comment.create(req.body.comment,function(err,comment){
				if(!err){
					comment.author.id = req.user._id;
               		comment.author.username = req.user.username;
					comment.save();
					post.comments.push(comment);
					post.save();
					req.flash("success","done ✔");
					res.redirect("/blogs/"+req.params.id);
				}
			});
		}
	});
});
//reply to comment
app.get("/blogs/:id/comments/:commentId/reply",middleWare.isLoggedIn,function(req,res){
	Blog.findById(req.params.id,function(err,post){
		if(err)res.redirect("blogs");
		else{
			res.render("reply",{postId:req.params.id,commentId:req.params.commentId});
		}
	});
});
//put the reply
app.put("/blogs/:id/comments/:commentId/reply",middleWare.isLoggedIn,function(req,res){
	Comment.findById(req.params.commentId,function(err,theComment){
		if(!err){
			Comment.create(req.body.comment,function(err,reply){
				reply.author.id = req.user._id;
				reply.author.username = req.user.username;
				reply.parent = theComment.author.username;
				reply.save();
				console.log(reply.parent);
				theComment.replies.push(reply);
				theComment.save();
				req.flash("success","done ✔");
				res.redirect("/blogs/"+req.params.id);
			});
		}
	});
});
//edit the comment 
app.get("/blogs/:id/comments/:comment_id/edit",middleWare.isLoggedIn,middleWare.checkUserComment,function(req,res){
	Comment.findById(req.params.comment_id,function(err,theComment){
		if(!err){
			res.render("editComment",{postId:req.params.id,theComment:theComment});
		}
	});
});
//update comment
app.put("/blogs/:id/comments/:comment_id/edit",middleWare.isLoggedIn,middleWare.checkUserComment,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,theComment){
		if(!err){
			req.flash("success","done ✔");
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//update blog post
app.put("/blogs/:id",middleWare.isLoggedIn,middleWare.checkUserBlogPost,function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedPosted){
		if(err)res.redirect("blogs");
		else{
			req.flash("success","Post updated");
			res.redirect("/blogs/"+req.params.id);
		}
	});
});
//delete a comment
app.delete("/blogs/:id/comments/:comment_id",middleWare.isLoggedIn,middleWare.checkUserComment,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(!err){
			req.flash("error","Comment removed!");
			res.redirect("/blogs/"+req.params.id);
		}
	});
});
//delete a blog post
app.delete("/blogs/:id",middleWare.isLoggedIn,middleWare.checkUserBlogPost,function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		 if(!err){
			 req.flash("success","post deleted!");
			 res.redirect("/blogs/");	
		 }else{
			 req.flash("error","Permission denied!");
			 res.redirect("/blogs/");	
		 }
	});
});

//connect with the server
app.listen(3000,function(){
	console.log("server is running!")
});
