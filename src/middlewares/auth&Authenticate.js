const Campground = require('../models/campground')
const Review = require('../models/reviews')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
     req.flash('error','You must be logged In!')
       req.session.returnTo = req.originalUrl
       return res.redirect('/login')
    }
    next()
}

module.exports.campground = async (req,res,next)=>{
  const camp = await Campground.findById(req.params.id).populate('author')
   if(!camp.author.equals(req.user)){
     req.flash('error','You have do not have permission to do that!')   
    return res.redirect(`/campgrounds/${camp._id}`)
      }
  next()
    }

    module.exports.review = async (req,res,next)=>{
      const review = await Review.findById(req.params.reviewId).populate('author')
       if(!review.author.equals(req.user)){
         req.flash('error','You have do not have permission to do that!')   
        return res.redirect(`/campgrounds/${req.params._id}`)
          }
      next()
        }


