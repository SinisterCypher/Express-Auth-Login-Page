//Importing modules and dependencies 
// Using import and export syntax in node
import express, { json } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv'
import expressEjsLayouts from 'express-ejs-layouts';
import fs from 'fs';
import path from 'path';
import { Console } from 'console';

// Load .env file into process.env
dotenv.config();

const app = express()
const PORT = process.env.PORT || 5050;
// App Configuration 
app.use(morgan('dev'));
app.set("view engine", "ejs");
app.use(express.static('public/'));
// Express.urlencoded is an middleware that parse urlencoded data passed from the form into a json obejct 
// It appends the urlencoded data after conversion to json in req.body 
// if we have 
app.use(express.urlencoded({ extended: true }))
// Routes

let users = []
let isAuthenticated = false;

let loggedUser = {}

app.get("/", (req, res) => {
    res.render('index')
})

app.use('/signUp', (req, res, next) => {
    const { username, email, password } = req.body;
    if (username && email && password) {
        req.data = req.body
        next()
        return;
    }
    res.send("We must need username, email and Password");

})
// When user hits POST /register
app.post('/signUp', (req, res, next) => {
    const newUser = req.data;
    const data = fs.readFileSync(path.join('db', 'data.json'), 'utf8');

    const users = JSON.parse(data) || [];
    console.log(users)

    users.push(newUser);

    fs.writeFileSync(path.join('db', 'data.json'), JSON.stringify(users))
    res.redirect('/login')

})





app.get('/register', (req, res) => {
    res.render('ask_toregister');

})


app.get("/login", (req, res) => {
    res.render('ask_login')
})

app.post('/login' ,(req,res,next)=>{
    const {email, password} = req.body; 
    console.log(req.body);
    if(!email && !password){
       return res.send("we need both email and password")
    }
    const data = fs.readFileSync(path.join('db', 'data.json') , 'utf-8')
    const users = JSON.parse(data)
    console.log(users);
    const user = users.find((user)=>{
        return user.email == email && user.password == password
    })
    console.log(user)
    if(user){
       isAuthenticated = true;
       loggedUser = user;
       res.redirect('/welcome'); 
    }
})


app.get('/welcome', (req,res)=>{
    if(isAuthenticated){
        const user = loggedUser;
       return res.render("welcome",{user})
    }
   return res.status(401).send("you aren't allowed")
})

app.listen(PORT, () => {
    console.log(`Server is Listening on ${PORT}`);

})