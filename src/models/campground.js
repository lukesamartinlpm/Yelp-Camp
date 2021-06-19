const mongoose = require('mongoose')
const Review = require('./reviews')

const imageSchema = new mongoose.Schema({
    url:String,
    filename:String,
    })
imageSchema.virtual('thumbnail').get(function(){
return this.url.replace('/upload/', '/upload/w_200/')
})

const  campgroundSchema = new mongoose.Schema({
    title:String,
    price:Number, 
    description:String,
    location:String,
    geometry:{
      type:{   
          type:String,
          enum:['Point'],
          required:true
        },
        coordinates:{ 
        type:[Number],
        required:true
        }
     },
    images:[imageSchema],
    reviews:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'reviews'
        }],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }
}, {toJSON: { virtuals: true } } )

campgroundSchema.virtual('properties.popUpMarkup').get(function(){
   return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong> <p class='text-muted'>${this.description.substring(0,100)}...</p>`
})


campgroundSchema.pre('remove',async function (next){
    const campground = this
    const review = await Review.deleteMany({_id:{$in:campground.reviews}})
    next()
})

const Campground =  mongoose.model('campground',campgroundSchema)

module.exports = Campground