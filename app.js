require('express-async-errors'); 
const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi); //to validate objectID type
const config=require('config');
const winston=require('winston');

const express=require('express');
const app=express();
const genres=require('./routes/genres');
const customers=require('./routes/customers');
const movies=require('./routes/movies');
const rentals=require('./routes/rentals');
const users=require('./routes/users');
const auth=require('./routes/auth');
const error=require('./middleware/error');

winston.add(winston.transports.File,{filename:'logfile.log'});

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

app.use('/api/genres',genres);
app.use('/api/customers',customers);
app.use('/api/movies',movies);
app.use('/api/rentals',rentals);
app.use('/api/users',users);
app.use('/api/auth',auth);

app.use(error);

const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/vidly-db',{useNewUrlParser:true})
.then(()=>console.log("Connected to database."))
.catch(()=>console.log("Couldnt connect to database."));


//CREATE SERVER
const port=process.env.PORT || 3000;
app.listen(port,console.log(`Listening to port ${port}...`));