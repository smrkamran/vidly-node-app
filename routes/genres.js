const express=require('express');
const router=express.Router();
router.use(express.json());
router.use(express.urlencoded({extended:true})); //to use for URLEncoded res.body means "key=value&key=value" form (x-wwww-form-urlencoded)

const auth=require('../middleware/auth');
const admin=require('../middleware/admin');
const {Genre,validateGenre}=require('../models/genre');
//const asyncMiddleware=require('../middleware/async');

//All GENRES
router.get('/',async (req,res,next)=>{
        const genres=await Genre.find().sort('name');
        res.send(genres);    
});

//GET SINGLE GENRE
router.get('/:id',async (req,res)=>{
    const genre=await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('No Genre found with this Id.')
    res.send(genre);
});

//POST NEW GENRE
router.post('/',auth,async (req,res)=>{
    const { error } = validateGenre(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let genre = new Genre({ name: req.body.name });
    try {
        await genre.save();
        res.send(genre);
    } catch (ex) {
        for(field in ex.errors){
            console.log(ex.errors[field].message);
            res.send(ex.errors[field].message);
         }
    }
});

//UPADTE GENRE
router.put('/:id',auth, async (req,res)=>{
    const {error}=validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre=await Genre.findByIdAndUpdate(req.params.id,
        {name: req.body.name},
        {new: true});
    if(!genre) return res.status(404).send('Cannot find genre with this Id.');

    res.send(genre);

});

//DELETE GENRE
router.delete('/:id',[auth,admin],async (req,res)=>{
    const genre=await Genre.findByIdAndRemove(req.params.id);
    if(!genre) return res.status(404).send('Cannot find genre with this Id.');
    res.send(genre);
});

module.exports=router;