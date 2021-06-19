const Review = require('../models/reviews')
const ExpressError = require('../utils/expressError')
const Campground = require('../models/campground')

module.exports.post = async (req,res)=>{
    const campground = await Campground.findById({_id:req.params.id})
    const review = new Review(req.body)
    campground.reviews.push(review) 
    review.author = req.user._id
    await campground.save()
    await review.save() 
    req.flash('success','Successfully added a review!')   
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.delete = async (req,res)=>{
    const {id,reviewId} = req.params
      const campground = await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
      const review = await Review.findByIdAndDelete(reviewId)
      req.flash('success','Successfully deleted')   
      res.redirect(`/campgrounds/${campground._id}`)
  }
  
