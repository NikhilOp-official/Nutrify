const jwt = require("jsonwebtoken");
//middleware 
function verifyToken(req,res,next) {

    if(req.headers.authorization!==undefined){
      let token =req.headers.authorization.split(" ")[1]
 jwt.verify(token,"nutrifyapp",(err,data)=>{
  if(!err){
    next();
  }
  else{
    res.status(403).send({message:"invalid token"})
  }

 })
    }
    else{
      res.send({message:"please send a token"})

    }


 


  
}



module.exports = verifyToken;