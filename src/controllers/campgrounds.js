const Campground = require('../models/campground')
const ExpressError = require('../utils/expressError')
const { cloudinary } = require('../cloudinary/')
const geoToken = process.env.MAPBOX_TOKEN
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const geocoder = mbxGeocoding({accessToken: geoToken})

module.exports.index = async (req,res)=>{
    const campground = await Campground.find({})
    res.render('index',{campground})
}

module.exports.campground = async (req,res)=>{
    const id = req.params.id
    const campground = await Campground.findById(id).populate('author').populate({
    path: 'reviews',
    populate:{
        path:'author'
    }
})
    if(!campground){
        req.flash('error','Cannot find campground!')   
     return  res.redirect('/campgrounds/')
    }
    res.render('show',{campground})
 }

 module.exports.edit =async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('edit',{campground})
}

module.exports.post = async (req,res) => {
    if(!req.body) throw new ExpressError('Bad Request',404)
    const campground = new Campground(req.body) 
    campground.images = req.files.map( f => ({filename: f.filename, url: f.path}))
    campground.author = req.user._id
    const geoData = await geocoder.forwardGeocode({
        query: campground.location,
        limit: 1
      }).send()
    campground.geometry = geoData.body.features[0].geometry
 const camp = await campground.save()
    req.flash('success','Successfully created a new campground!')    
res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.delete = async (req,res)=>{
    const campground = await Campground.findOne({_id:req.params.id})
    await campground.remove()
    req.flash('success','Successfully removed campground!')    
    res.redirect('/campgrounds')
}

module.exports.update = async (req,res)=>{
    if(!req.body) throw new ExpressError('Bad Request',404)
    const imgs = req.files.map( f => ({filename: f.filename, url: f.path}))
    const campground = await Campground.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true})
        campground.images.push(...imgs)
        if(req.body.deleteImages){
            console.log(req.body.deleteImages)
            for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)   
            }
            await campground.updateOne({ $pull:{images : { filename: { $in: req.body.deleteImages} } } })
    }
        await campground.save()
        req.flash('success','Successfully updated campground!')     
    res.redirect(`${req.params.id}`)
    }
    
module.exports.new = (req,res)=>{
    res.render('new')
}