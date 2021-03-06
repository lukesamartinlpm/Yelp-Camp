const baseJoi = require('joi')
const ExpressError = require('../utils/expressError')
const sanitizeHTML = require('sanitize-html')

const extension = (joi)=>(
    {
type:'string',
base:joi.string(),
messages:{
'string.escapeHTML' : '{{#label}} must not include HTML!'
},
rules:{
    escapeHTML:{
        validate(value,helpers){
    const clean = sanitizeHTML(value,{
        allowedTags:[],
        allowedAttributes:{}
    })
     if(clean !== value) return helpers.error('string.escapeHTML',{value})
     return clean;
    }
}
}
})

const Joi = baseJoi.extend(extension)

module.exports.campground = (req,res,next)=>{
    const campgroundSchema = Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        description :Joi.string().required().escapeHTML(), 
        deleteImages :Joi.array()
    }).required()
   
    const { error } = campgroundSchema.validate(req.body)
      if(error){
          const msg = error.details.map(el => el.message).join(',')
          throw new ExpressError(msg,400)
        }
    next()
}

module.exports.review = (req,res,next)=>{
    const reviewsSchema = Joi.object({
        rating: Joi.number().required().min(0).max(5),
        body: Joi.string().required().escapeHTML() 
    }).required()
    const {error} = reviewsSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
      }
  next()
}
