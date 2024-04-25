const express = require('express');
const router = express.Router();
const User = require('../models/user');
const PlantUser = require('../models/user_plant');
const helpers = require('./helpers')

router.get('/register', async (req, res, next) => {
  if (helpers.isLoggedIn(req, res)) {
    return
  }
  res.render('users/register', { title: 'PlantCare || Registration' });
});

router.post('/register', async (req, res, next) => {
  console.log('body: ' + JSON.stringify(req.body));
  if (helpers.isLoggedIn(req, res)) {
    return
  }
  const user = await User.getByEmail(req.body.email)
  if (user) {
    res.render('users/register', {
      title: 'PlantCare|| Login',
      flash: {
        type: 'danger',
        intro: 'Error!',
        message: `A user with this email already exists`}
    });
  } else {
    await User.add(req.body);
    req.session.flash = {
      type: 'info',
      intro: 'Success!',
      message: `the user has been created!`,
    };
    res.redirect(303, '/');
  }
});

router.get('/login', async (req, res, next) => {
  if (helpers.isLoggedIn(req, res)) {
    return
  }
  res.render('users/login', { title: 'PlantCare|| Login' });
});

router.post('/login', async (req, res, next) => {
  console.log('body: ' + JSON.stringify(req.body));
  if (helpers.isLoggedIn(req, res)) {
    return
  }
  const user = await User.login(req.body)
  if (user) {
    req.session.currentUser = user
    req.session.flash = {
      type: 'info',
      intro: 'Success!',
      message: 'You are now logged in',
    };
    res.redirect(303, '/');
  } else {
    res.render('users/login', {
      title: 'PlantCare|| Login',
      flash: {
        type: 'danger',
        intro: 'Error!',
        message: `Wrong email and password combination or the user could not be found`}
    });
  }
});

router.post('/logout', async (req, res, next) => {
  delete req.session.currentUser
  req.session.flash = {
    type: 'info',
    intro: 'Success!',
    message: 'You are now logged out',
  };
  res.redirect(303, '/');
});

router.get('/profile', async (req, res, next) => {
  if (helpers.isNotLoggedIn(req, res)) {
    return
  }
  const plantsUser = await PlantUser.AllForUser(req.session.currentUser);
  res.render('users/profile', { title: 'PlantCare|| Profile', user: req.session.currentUser, plantsUser: plantsUser, statuses: PlantUser.statuses });
});

module.exports = router;
