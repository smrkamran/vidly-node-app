const Joi=require('joi');
const mongoose=require('mongoose');
const {genreSchema}=require('./genre');

const Movie=mongoose.model('Movie',new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:100
    },
    numberInStock:{
        type:Number,
        required:true,
        min:0,
        max:255
    },
    dailyRentalRate:{
        type:Number, 
        required:true,
        min:0,
        max:255
    },
    genre:{
        type:genreSchema,
        required:true
    }
}));

//VALIDATE
function validateMovie(movie){
    const schema={
        title:Joi.string().min(4).required(),
        numberInStock:Joi.number().min(0).required(),
        dailyRentalRate:Joi.number().min(0).required(),
        genreId :Joi.objectId().required()
    };
    return Joi.validate(movie,schema);
}

exports.Movie=Movie;
exports.validateMovie=validateMovie;