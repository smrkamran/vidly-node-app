const {Rental,validateRental}=require('../models/rental');
const {Movie}=require('../models/movie');
const {Customer}=require('../models/customer');
const auth=require('../middleware/auth');

const mongoose=require('mongoose');
const express=require('express');
const Fawn=require('fawn');
Fawn.init(mongoose);

const router=express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:true}));

//Get all rentals
router.get('/',auth,async (req,res)=>{
    const rentals=await Rental.find().sort('-dateOut');
    res.send(rentals);
});

//Get single rental
router.get('/:id',async (req,res)=>{
    const rental=Rental.findById(req.params.id);
    if(!rental) return res.status(404).send('Cannot find rental against this id.');

    res.send(rental);
});

//Post new rental
router.post('/',async (req,res)=>{
    const {error}=validateRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const customer=await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid Customer.');

    const movie=await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid Movie.');

    if(movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

    let rental=new Rental({
        customer:{
            _id:customer._id,
            name:customer.name,
            phone:customer.phone,
            isGold:customer.isGold
        },
        movie:{
            _id:movie._id,
            title:movie.title,
            dailyRentalRate:movie.dailyRentalRate
        }
    });
    // rental=await rental.save();

    // movie.numberInStock--;
    // movie.save();

    try {
        new Fawn.Task()
        .save('rentals',rental)
        .update('movies',{ _id:movie._id },{
            $inc:{ numberInStock:-1 }
            })
        .run();
        res.send(rental);
    } catch (ex) {
        res.status(500).send('Something went wrong.');
    }
    
});


module.exports=router;