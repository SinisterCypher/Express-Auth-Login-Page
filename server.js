
//Importing modules and dependencies 

// Using import and export syntax in node
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import expressLayouts from 'express-ejs-layouts';

// Load .env file into process.env
dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;

// App Configuration 
app.use(morgan('dev'));
app.set("view engine", "ejs");
app.use(express.static('public/'));
app.use(expressLayouts)


// Routes

app.get("/", (req, res) => {
    res.render('index')

})

app.get('/register', (req, res) => {
    res.render('ask_toregister');

})

app.get("/login", (req, res) => {
    res.render('ask_login')
})



app.listen(PORT, () => {
    console.log(`Server is Listening on ${PORT}`);

})