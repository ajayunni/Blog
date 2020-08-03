var mongoose = require("mongoose");
var Blog = require("./models/blog");
var Comments = require("./models/comments");
var data = [
	{
		title:"POST 1",
		image:"https://pixabay.com/get/53e3d1414a56a514f6d1867dda35367b1c3cd8e35553714b_1920.jpg",
		body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tristique laoreet dui sed suscipit. Fusce id finibus dui, elementum finibus orci. Aliquam rutrum id quam tincidunt ultrices. Duis aliquam eget augue eget malesuada. Fusce augue leo, ultricies nec sodales sed, efficitur ac nisi. Aenean placerat est vitae eros rhoncus, ac vehicula ipsum finibus. Donec a molestie turpis, a varius leo. Suspendisse rhoncus ante vitae congue faucibus. Vivamus molestie maximus lectus, non finibus mi. Fusce at vulputate odio. Aliquam vitae enim sodales elit tristique vulputate. Ut tortor est, dignissim bibendum consectetur finibus, efficitur id metus. Fusce mattis rhoncus ante, ac interdum justo auctor quis."
	},
	{
		title:"POST 2",
		image:"https://pixabay.com/get/53e1d04b425aab14f6d1867dda35367b1c3cd8e35550784b_1920.jpg",
		body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tristique laoreet dui sed suscipit. Fusce id finibus dui, elementum finibus orci. Aliquam rutrum id quam tincidunt ultrices. Duis aliquam eget augue eget malesuada. Fusce augue leo, ultricies nec sodales sed, efficitur ac nisi. Aenean placerat est vitae eros rhoncus, ac vehicula ipsum finibus. Donec a molestie turpis, a varius leo. Suspendisse rhoncus ante vitae congue faucibus. Vivamus molestie maximus lectus, non finibus mi. Fusce at vulputate odio. Aliquam vitae enim sodales elit tristique vulputate. Ut tortor est, dignissim bibendum consectetur finibus, efficitur id metus. Fusce mattis rhoncus ante, ac interdum justo auctor quis."
	},
	{
		title:"POST 3",
		image:"https://pixabay.com/get/53e3d1414352ab14f6d1867dda35367b1c3cd8e35550784f_1920.jpg",
		body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tristique laoreet dui sed suscipit. Fusce id finibus dui, elementum finibus orci. Aliquam rutrum id quam tincidunt ultrices. Duis aliquam eget augue eget malesuada. Fusce augue leo, ultricies nec sodales sed, efficitur ac nisi. Aenean placerat est vitae eros rhoncus, ac vehicula ipsum finibus. Donec a molestie turpis, a varius leo. Suspendisse rhoncus ante vitae congue faucibus. Vivamus molestie maximus lectus, non finibus mi. Fusce at vulputate odio. Aliquam vitae enim sodales elit tristique vulputate. Ut tortor est, dignissim bibendum consectetur finibus, efficitur id metus. Fusce mattis rhoncus ante, ac interdum justo auctor quis."
	}
]

function seedDB(){
	Blog.deleteMany({},function(err){
		if(!err){
			data.forEach(function(seed){
				Blog.create(seed,function(err,seed){
					if(!err){
						Comments.create({
							comment:"This is amazing article!",
							author:"Homer Simpson"
						},function(err,commentMade){
							if(!err){
								seed.comments.push(commentMade);
								seed.save();
							}
						});
					}
				});
			});
		}
	});
}
module.exports =  seedDB;