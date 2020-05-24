const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load Admin model
const Admin = require('../models/Admin');
const { forwardAuthenticated,ensureAuthenticated } = require('../config/auth');

// Login Page
router.get('/admin_login', forwardAuthenticated, (req, res) => res.render('admin/admin_login'));

// Register Page
router.get('/admin_register', forwardAuthenticated, (req, res) => res.render('admin/admin_register'));

// Register
router.post('/admin_register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('admin/admin_register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //Validtion success
    Admin.findOne({ email: email }).then(admin => {
      if (admin) {
        //admin already exists
        errors.push({ msg: 'Email already exists' });
        res.render('admin/admin_register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newAdmin = new Admin({
          name,
          email,
          password
        });
        //Hash password using bcrypt js
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hash
            newAdmin.password = hash;
            //save admin
            newAdmin.save()
              .then(admin => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/admin_login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});
// Login
router.post('/admin_login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin_dashboard',
    failureRedirect: '/admin_login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/admins/admin_login');
});

// Dashboard
router.get('/admin_dashboard', ensureAuthenticated, (req, res) =>
  res.render('admin_dashboard', {
    name: req.admin.name
  })
);

module.exports = router;