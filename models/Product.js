const mongoose=require('mongoose');


const ProductSchema=new mongoose.Schema({
	image_path:{
		type:String,
		required:true
	},
	name:{
		type:String,
		required:true
	},
	description:{
		type:String,
		required:true
	},
	price:{
		type:Number,
		required:true
	}
});

const Product=mongoose.model('Product',ProductSchema);
module.exports=Product;