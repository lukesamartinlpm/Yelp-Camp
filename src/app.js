require('./db/mongoose')
const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/expressError')
const campgrounds = require('./routers/campgrounds')
const reviews = require('./routers/reviews')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const passportLocal = require('passport-local')
const Users = require('./models/users.js')
const users = require('./routers/users')
const expressMongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const MongoDbStore =  require('connect-mongo')

const {scriptSrcUrls,styleSrcUrls,connectSrcUrls,fontSrcUrls} = require('./utils/helmetSecurity')

const publicDirectoryPath = path.join(__dirname,'./public');
const viewsTemplatesDirectory = path.join(__dirname,'./templates/views');
const partialsTemplatesDirectory = path.join(__dirname,'./templates/partials')

const sessionConfig = {
  store: MongoDbStore.create(
    {
      mongoUrl:process.env.MONGODB_ADDRESS,
      secret:process.env.SESSION_SECRET,
      touchAfter: 24 * 60 * 60
    }),
  name: 'session',
  // secure : true,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          childSrc: ["blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/ddrukjarm/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
              "https://images.unsplash.com",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

app.use(expressMongoSanitize())

app.use(express.static(publicDirectoryPath))
app.set('view engine','ejs')
app.engine('ejs',ejsMate)
app.set('views',viewsTemplatesDirectory)

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(Users.authenticate()))
passport.serializeUser(Users.serializeUser())
passport.deserializeUser(Users.deserializeUser())

app.use(flash())
app.use((req,res,next)=>{
  res.locals.success = req.flash('success')
  res.locals.err = req.flash('error')
  res.locals.isLogged = req.user
  next()
})
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)
app.use(users)

app.get('/',async (req,res)=>{
  res.render('home')
})

app.all('*',(res,req,next)=>{
next(new ExpressError('Not Found',404))
})

app.use((err,req,res,next)=>{
  const {statusCode = 500} = err
  if(!err.message) err.message = 'Something Went Wrong'
  res.status(statusCode).render('error',{err})
})


module.exports = app