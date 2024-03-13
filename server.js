// import essential module using import/export syntax in node 

import express from "express";
import dotenv from 'dotenv'; 
import flash from 'express-flash'
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from 'bcrypt'; 
import morgan from "morgan";
import { initializePassport } from "./passport-config";
// Calling dotenv.config () after importing doteve , this dotenv.config attaches our varibles in .env file in our process.env root
dotenv.config()
// initialize passport 

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



app.use(flash()); 
app.use(session({
    secret: process.env.secret, 
    resave: false, 
    saveUninitialized:false
}))


app.use(passport.initialize()); 
app.use(passport.session())

passport.use(LocalStrategy); 
// using express body parser to change json data into js obeject and append it to req body

app.use(express.json()); 
app.use(express.urlencoded({extended:true}))




/// Routes 
/// Home page GET Route 
app.get('/', (req,res,next)=>{
    res.render('index', {indexcss: './public/index.css' }) 

});



app.post('/login',passport.authenticate(passport.Strategy('local'),{
    successRedirect:'/welcome', 
    failureRedirect:'/', 
    failureFlash:true
})); 
app.get('/login', (req, res)=>{
    res.render('ask_login')
})
app.get('/register', (req, res)=>{
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
    console.log(users)  
    res.redirect('/login') 

   }
   catch(err){
    res.send(err)
    // res.redirect('/register')
   }

})




const PORT= process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`)
})