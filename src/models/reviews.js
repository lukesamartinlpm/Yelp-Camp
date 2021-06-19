const mongoose = require('mongoose')

const reviewsSchema = new mongoose.Schema({
    body:String,
    rating:Number,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    }
})


const Review = mongoose.model('reviews',reviewsSchema)

module.exports = Review