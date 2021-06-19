const express = require('express')
const router = new express.Router()
const validate = require('../middlewares/schemas.js')
const catchAsync = require('../utils/catchAsync')
const auth = require('../middlewares/auth&Authenticate') 
const campgrounds = require('../controllers/campgrounds')
const { storage, cloudinary } = require('../cloudinary/')
const multer = require('multer')
const upload = multer({storage})

router.route('/')
.get(catchAsync(campgrounds.index))
.post(auth.isLoggedIn,upload.array('images'),validate.campground,catchAsync(campgrounds.post))

router.get('/new',auth.isLoggedIn,campgrounds.new)

router.get('/:id/edit',auth.isLoggedIn,auth.campground,catchAsync(campgrounds.edit))

router.route('/:id')
.get(catchAsync(campgrounds.campground))
.delete(auth.isLoggedIn,auth.campground,catchAsync(campgrounds.delete))
.patch(auth.isLoggedIn,auth.campground,upload.array('images'),validate.campground,catchAsync(campgrounds.update))


module.exports = router