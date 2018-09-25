const mongoose=require('mongoose');
const Joi=require('joi');
const Customer=mongoose.model("Customer",mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:4,
        maxlength:50
    },
    phone:{
        type:String,
        required:true,
        minlength:11,
        maxlength:15
    },
    isGold:{
        type:Boolean,
        default:false,
        required:true
    }
}));


//VALIDATE NAME
function validateCustomer(customer){
    const schema={
        name:Joi.string().min(4).required(),
        phone:Joi.string().min(11).max(15).required(),
        isGold:Joi.boolean().required()
    };
    return Joi.validate(customer,schema);
}

exports.Customer=Customer;
exports.validateCustomer=validateCustomer;