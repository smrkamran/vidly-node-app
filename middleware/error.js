module.exports=function(err,req,res,next){
    //log the err
    res.status(500).send('Unexpected error occured.');
};