const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const expressValidator = require('express-validator')
const config = require('./config/db')

const app = express()

const index = require('./routes/index')
const articles = require('./routes/articles')
const article = require('./routes/article')
const users = require('./routes/users')

// DB Connection

mongoose.connect(config.database,{ useNewUrlParser: true })
let db = mongoose.Connection
if(db){
  console.log("connected to Db")
}else console.log('error connecting to db!')

// Middlewares

  //Bodyparser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
  
  //Express sessions Middleware
  app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
  }))

  // Express Messages middleware
  app.use(require('connect-flash')());
  app.use((req,res,next)=>{
    res.locals.messages=require('express-messages')(req,res);
    next();
  })

  // Express Validator
app.use(expressValidator({
  errorFormatter:function(param,msg,value){
    var namespace=param.split('.'),
    root=namespace.shift(),
    formParam=root

    while(namespace.length){
      formParam+='['+namespace.shift()+']'
    }
    return{
      param:formParam,
      msg:msg,
      value:value
    }
  }
}))

// Passport config
require('./config/passport')(passport)
// passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.get('*',(req,res,next)=>{
  res.locals.user = req.user || null
  next()
})

// My middlewares

app.use('/',index)
app.use('/articles',articles)
app.use('/article',article)
app.use('/users',users)

// Set public floder
 app.use(express.static(path.join(__dirname,'public')))

// Bring in Models
let Article = require('./models/article')

// View engine

app.set('views',path.join(__dirname,'view'));
app.set('view engine','jade')

const PORT = process.env.PORT||8000

app.listen(PORT,()=>{
  console.log(`server Started on Port ${PORT}`)
})