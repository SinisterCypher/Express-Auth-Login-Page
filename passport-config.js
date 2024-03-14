
// In this file we are going to store all the passport related methods 

import {Strategy as LocalStrategy}  from 'passport-local'
import bcrypt from 'bcrypt'; 


export default function initialize(passport, getUserByEmail , getUserById){
    const authenticateUser = async(email, password, done)=>{
            const user = getUserByEmail(email) 
            if(!user) {
                return done(null, false, {message: "no user with that email"}); 

            }
            try{
                if(await bcrypt.compare(password, user.password))
                {
                    return done(null, user)
                } 
                else{ return done(null, false, {message:"passsword incorrect"})
                }
            }
            catch(err){
                done(err)
            }
    }

    passport.use( new LocalStrategy ({usernameField:'email', passwordField:'password'},authenticateUser))
    
    // passport for serializing users : Assining user a session id 
    passport.serializeUser((user,done)=>{
            done(null, user.id)
    })
    // deserializeUser returns a user from session id , essentialy chekcing if the id is assigned to a valid user or not 

    passport.deserializeUser((id,done)=>{
            done(null, getUserById(id));  
    })
}
