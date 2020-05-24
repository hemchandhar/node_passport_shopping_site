const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('user/login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('user/register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2,phone_number } = req.body;
  let errors = [];
  console.log(phone_number);
  if (!name || !email || !password || !password2 || !phone_number) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
 // function phonenumber(inputtxt)
 //  {
 //  console.log(inputtxt);
 //  var phoneno = /^\d{10}$/;
 //  if((inputtxt.value.match(phoneno)))
 //        {
 //      return true;
 //        }
 //      else
 //        {
 //        alert("message");
 //        return false;
 //        }
 //  }
  if(phone_number.length !== 10){
    errors.push({ msg: 'Phone number must contain 10 digits'});
    }



   
  if (errors.length > 0) {
    res.render('user/register', {
      errors,
      name,
      email,
      password,
      password2,
      phone_number
    });
  } else {
    //Validtion success
    User.findOne({ email: email }).then(user => {
      if (user) {
        //User already exists
        errors.push({ msg: 'Email already exists' });
        res.render('user/register', {
          errors,
          name,
          email,
          password,
          password2,
         phone_number
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          phone_number
        });
        //Hash password using bcrypt js
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hash
            newUser.password = hash;
            //save user
            newUser.save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;