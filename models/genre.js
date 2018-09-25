const Joi=require('joi');
const mongoose=require('mongoose');

const genreSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:16
    }
});
const Genre=mongoose.model('Genre',genreSchema);

//VALIDATE NAME
function validateGenre(genre){
    const schema={
        name:Joi.string().min(4).required()
    };
    return Joi.validate(genre,schema);
}

exports.genreSchema=genreSchema;
exports.Genre=Genre;
exports.validateGenre=validateGenre;