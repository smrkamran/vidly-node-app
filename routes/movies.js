const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
router.use(express.json());
router.use(express.urlencoded({extended:true}));

const {Movie,validateMovie}=require('../models/movie');
const {Genre}=require('../models/genre');

//All Movies
router.get('/',async (req,res) => {
    const movies=await Movie.find().sort('title');
    res.send(movies);
});

//Get Single Movie
router.get('/:id',async (req,res) => {
    const movie=Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('No movie found against this id.');
    res.send(movie);
});

//Post New Movie
router.post('/',auth,async (req,res) => {
    const {error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre=await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre.');

    let movie=new Movie({
        title:req.body.title,
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate,
        genre:{
            _id:genre._id,
            name:genre.name
        }
    });

        try {
            await movie.save();
            res.send(movie);
        } catch (ex) {
            for (field in ex.errors) {
                console.log(ex.errors[field].message);
                res.send(ex.errors[field].message);
            }
        }
});

//Update Movie
router.put('/:id',auth,async (req,res)=>{
    const {error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const movie=await Movie.findByIdAndUpdate(req.params.id,
            {title:req.body.title,
            numberInStock:req.body.numberInStock,
            dailyRentalRate:req.body.dailyRentalRate,
            genre:req.body.genre},
            {new:true});

    if(!movie) return res.status(404).send('No movie found against this id.');
    res.send(movie);
});

//Delete Movie
router.delete('/:id',auth,async (req,res)=>{
    const movie=await Movie.findByIdAndRemove(req.params.id);
    if(!movie) return res.status(404).send('No movie found against this id.');
    res.send(movie);
});

module.exports=router;