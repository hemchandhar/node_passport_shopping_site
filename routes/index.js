const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Cart = require('../models/cart');
const Product=require('../models/Product');
const Order=require('../models/Order');

// Welcome Page
router.get('/', (req, res) => {
	var successMsg=req.flash('success_msg')[0];
	Product.find(function(err,docs){
		var productChunks=[];
		var chunkSize=3;
		for(let i=0;i<docs.length;i+=chunkSize){
			productChunks.push(docs.slice(i,i+chunkSize));
		}
		res.render('shopping/welcome',{title:'Welcome',products:productChunks,successMsg:successMsg,noMessages:!successMsg}); 
	});
	
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('user/dashboard', {
    name: req.user.name
  })
);

//add-to-cart
router.get('/add-to-cart/:id',function(req,res,next){
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {}); 

	Product.findById(productId,function(err,product){
		if(err){
			return res.redirect('/');
		}
		cart.add(product,product.id);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect('/');
	});
});
router.get('/reduce/:id',function(req,res,next){
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {}); 
	cart.reduceByOne(productId);
	req.session.cart=cart;
	res.redirect('/shopping-cart');
});

router.get('/remove/:id',function(req,res,next){
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {}); 
	cart.removeItem(productId);
	req.session.cart=cart;
	res.redirect('/shopping-cart');
});

router.get('/shopping-cart',function(req,res,next){
	if(!req.session.cart){
		return res.render('shopping/shopping_cart',{products:null});
	}
	var cart = new Cart(req.session.cart);
	res.render('shopping/shopping_cart',{products:cart.generateArray(),totalPrice:cart.totalPrice});
});	

router.get('/checkout',isLoggedIn,function(req,res,next){
	if(!req.session.cart){
		return res.redirect('/shopping_cart');
	}
	var cart = new Cart(req.session.cart);
	var errMsg=req.flash('error')[0];
	res.render('shopping/checkout',{total: cart.totalPrice,errMsg:errMsg,noError:!errMsg});
});

router.post('/checkout',isLoggedIn,function(req,res,next){
	if(!req.session.cart){
		return res.redirect('/shopping_cart');
	}
	var cart = new Cart(req.session.cart);
	var stripe = require('stripe')('sk_test_0epAcACz9N24Iq94ErGKQJQZ00L3t2B0dt');
	stripe.charges.create(
	  {
	    amount: cart.totalPrice*100,
	    currency: 'inr',
	    source: "tok_mastercard",
	    description: 'My First Test Charge (created for API docs)',
	  },function(err, charge) {
	    if(err){
	    	req.flash('error_msg',err.message);
	    	return res.redirect('/checkout');
	    }
	    var order = new Order({
	    	user: req.user,
	    	cart: cart,
	    	address: req.body.address,
	    	name: req.body.name,
	    	paymentId: charge.id
	    });
	    order.save(function(err,result){
    	  req.flash('success_msg','successfully brought the products');
		  req.session.cart = null;
		  res.redirect('/');
	    });
	   
	  });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    req.session.oldUrl=req.url;
    res.redirect('/users/login');
  }
module.exports = router;