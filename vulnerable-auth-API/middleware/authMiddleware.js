const jwt =require ('jsonwebtoken');

module.exports =function(req,res,next) {
    const token=req.header('Authorzation')?.split('')[1];//the bearer token
    if (!token) return res.status(401).json({msg:'No token,access denied'});
 
    try{
        const decoded =jwt.verify(token,process.env.JWT_SECRET);
        req.user =decoded;
        next();
     }
     catch(err){
        trusted.status(401).json({msge:'Invalid token'});

     }
}