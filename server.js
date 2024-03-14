// import essential module using import/export syntax in node 

import express from "express";
import dotenv from 'dotenv'; 
import flash from 'express-flash'
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from 'bcrypt'; 
import morgan from "morgan";
import initialize from "./passport-config.js";
// Calling dotenv.config () after importing doteve , this dotenv.config attaches our varibles in .env file in our process.env root
dotenv.config()
// initialize passport  

const initializePassport = initialize

initializePassport(passport,(email)=>{return users.find(user=> user.email === email)}
, (id)=>{return users.find(user => user.id === id)})

let users = []
// App configuraiton 

const app = express()
// Set ejs as view engine 
app.set('view engine', 'ejs'); 

// Development environment 
app.use(morgan('dev'))

// serving static files from public folder 

app.use(express.static('public'))

import { MemoryStore as store } from "express-session";

app.use(flash()); 
app.use(session({
    secret: process.env.secret, 
    resave: false, 
    saveUninitialized:false,
    store: new store()
}))


app.use(passport.initialize()); 
app.use(passport.session())

passport.use(LocalStrategy); 
// using express body parser to change json data into js obeject and append it to req body

app.use(express.json()); 
app.use(express.urlencoded({extended:true}))




/// Routes 
/// Home page GET Route 
app.get('/', checkNotAuthenticated, (req,res,next)=>{
    res.render('index', {indexcss: './public/index.css' }) 

});



app.post('/login',passport.authenticate('local',{
    successRedirect:'/welcome', 
    failureRedirect:'/login', 
    failureFlash:true
})); 


app.get('/welcome', checkAuthenticated, (req, res)=>{
    console.log(req.user)
    const user = req.user.name
    // console.log(user)
    res.render('welcome', {user})
    
})

app.get('/contact',(req,res)=>{
    res.render('contactMe')
})
app.get('/login', checkNotAuthenticated, (req, res)=>{
    res.render('ask_login')
})

app.get('/register', checkNotAuthenticated, (req, res)=>{
    res.render('ask_toregister')
})



app.post('/signUp', async (req, res)=>{
   try{
    const hashedpassword = await bcrypt.hash(req.body.password, 10)
    users.push({
        id: Date.now().toString(),
        name: req.body.username, 
        email:req.body.email, 
        password: hashedpassword
    })
    res.redirect('/login') 

   }
   catch(err){
    res.send(err)
    // res.redirect('/register')
   }

})
app.get('/logOut',(req, res, next)=>{
    req.logout(req.user, err => {
    if(err) return next(err);
  });
    res.redirect('/')

})
app.get('/myprofile',checkAuthenticated, (req, res)=>{
    const user = req.user; 
    res.render('myprofile', {user})

})

function checkAuthenticated(req,res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login'); 
}

function checkNotAuthenticated (req,res, next){
    if(req.isAuthenticated()){
        return res.redirect('/welcome')

    }
    next()
}


const PORT= process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`)
})