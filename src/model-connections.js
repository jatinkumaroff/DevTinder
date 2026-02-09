const mongoose=require('mongoose')

const connectionSchema= mongoose.Schema({
   fromUserId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
   },
   toUserId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
   },
   status:{
    type:String,
    required:true,
    enum:{
        values:["interested","ignored","accepted","rejected"],
        message:"galat status mat daal"
    }
   },

},{timestamps:true});


module.exports = mongoose.model("ConnectionRequest",connectionSchema);