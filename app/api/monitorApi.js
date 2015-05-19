/**
 * Created by Ivan on 4/5/15.
 */

exports.status = function(req,res,next){
    res.status(200);
    res.json({'server':'0'});
    next();
}