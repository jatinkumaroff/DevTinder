const User=require("./model-user")
const jwt=require("jsonwebtoken");

const userAuth= async(req,res,next)=>{
    try {
        const token=req.cookies?.token
        if(!token){
            return res.status(401).send("Not logged in");
        }
     
        const payload= jwt.verify(token,"null");
    
        const loggedInUser=await User.findById(payload._id);

        if(!loggedInUser){
            return res.status(404).send("User Not Found");
        }
        
        req.user=loggedInUser;
    next();
    }catch(err){
        res.status(400).send("user auth mein error aa gya : "+err.message)
    }
}


module.exports = userAuth;