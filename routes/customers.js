const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
router.use(express.json());
router.use(express.urlencoded({extended:true})); //to use for URLEncoded res.body means "key=value&key=value" form (x-wwww-form-urlencoded)
const {Customer,validateCustomer}=require('../models/customer');

//get all customers
router.get('/',auth,async (req,res)=>{
    const customers=await Customer.find().sort('name');
    res.send(customers);
});
//post new customer
router.post('/',auth,async (req,res)=>{
    const {error}=validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let customer=new Customer({
        name:req.body.name,
        phone:req.body.phone,
        isGold:req.body.isGold
    });
    try{
        await customer.save();
        res.send(customer);
    }catch(ex){
        for (const field in ex.errors) {
            console.log(ex.error[field].message);
            res.send(ex.error[field].message);
        }
    }

});
//edit customer
router.put('/:id',auth,async (req,res)=>{
    const {error}=validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer=await Customer.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        phone:req.body.phone,
        isGold:req.body.isGold
    },{new:true});

    if(!customer) return res.status(404).send("Cannot find customer with this id.");

    res.send(customer);
});
//delete customer
router.delete('/:id',auth,async (req,res)=>{
    const cusotmer=await Customer.findByIdAndRemove(req.params.id);
    if(!cusotmer) return res.status(404).send('Cannot find customer with this id.');

    res.send(cusotmer);
})

module.exports=router;