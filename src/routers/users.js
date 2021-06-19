const express = require('express')
const router = new express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const {isLoggedIn} = require('../middlewares/auth&Authenticate')
const users = require('../controllers/users')

router.route('/register')
.get(catchAsync(users.register))
.post(catchAsync(users.signup))

router.route('/login')
.get(catchAsync(users.login))
.post(passport.authenticate('local',{failureFlash: true,failureRedirect: '/login'}),catchAsync(users.loginPost))    

router.get('/logout',isLoggedIn,users.logout)

module.exports = router