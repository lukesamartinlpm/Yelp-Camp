const express = require('express')
const router = new express.Router({mergeParams: true})
const validate = require('../middlewares/schemas.js')
const catchAsync = require('../utils/catchAsync')
const auth = require('../middlewares/auth&Authenticate')
const reviews = require('../controllers/reviews')

router.post('/',auth.isLoggedIn,validate.review,catchAsync(reviews.post))

router.delete('/:reviewId',auth.isLoggedIn,auth.review,catchAsync(reviews.delete))

module.exports = router