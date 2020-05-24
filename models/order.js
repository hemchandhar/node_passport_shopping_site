const mongoose=require('mongoose');

const Schema = mongoose.Schema;
const schema=new Schema({
	user:{
		type:Schema.Types.ObjectId,
		ref:'User'
	},
	cart:{
		type:Object,
		requried:true
	},
	address:{
		type:String,
		required:true
	},
	user:{
		type:String,
		required:true
	},
	paymentId:{
		type:String,
		required:true
	},
});

module.exports=mongoose.model('Order',schema);