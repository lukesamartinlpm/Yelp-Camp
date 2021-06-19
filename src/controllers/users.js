const Users = require('../models/users')
const ExpressError = require('../utils/expressError')

module.exports.register = async (req,res)=>{
    res.render('register')
    }
    
module.exports.signup = async (req,res)=>{
    const {username,
        email,
       password} = req.body
        try{
       const user = new Users({username,email})
       const registeredUser = await Users.register(user,password)
       req.flash('success','Welcome to Yelpcamp!')   
      res.redirect('/campgrounds/')
    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
    }

module.exports.login = async (req,res)=>{
    res.render('login')
    }

module.exports.loginPost = async (req,res)=>{
    const redirectUrl = req.session.returnTo || '/campgrounds'
    req.flash('success','Welcome back!')
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res)=>{
    req.logout()
    req.flash('success','Goodbye!')
    res.redirect('/campgrounds')
}
    
        