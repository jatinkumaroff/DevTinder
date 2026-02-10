const mongoose=require('mongoose')
const validator=require('validator')
const {DEF_ABOUT, DEF_PHOTO_URL}= require("./constants")

const userSchema= mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:50
    },
    emailId:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        validate:{
            validator:(value)=>{
                return validator.isEmail(value);
            },
            message:"valid email dal na gadhe"
        }
    },
    password:{
        type:String,
        required:true,
        // validate:{
        //     validator:(value)=>{
        //         return validator.isStrongPassword(value);
        //     },
        //     message:"password bada halka hai"
        // }
    },
    skills:{
        type:[String],
        //API LEVEL VALIDATION=> ATMOST 10 SKILLS AT A TIME
    },
    about:{
        type:String,
        default:DEF_ABOUT
    },
    photoUrl:{
        type:String,
        default:DEF_PHOTO_URL,
        validate:{
            validator: (value)=>{
                return validator.isURL(value);
            },
            message:"Bhai link??"
        }
    },
    age:{
        type:Number,
        validate:{
            validator:(value)=>{
                return value>=18;
            },
            message:"chhoti bacchi ho kya"
        }
    },
    gender:{
        type:String,
        enum:{
            values:["male","female"],
            message:"gender thik se likh"
        }
    },

})
// userSchema.index({ emailId: 1 }, { unique: true });


const User= mongoose.model("User",userSchema);
module.exports = User 