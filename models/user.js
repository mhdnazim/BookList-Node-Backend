import mongoose from "mongoose"
import mongooseUniqueValidator from "mongoose-unique-validator"

const userSchema = new mongoose.Schema({

    first_name : {
        type : String,
        required : true,
        trim : true
    },
    last_name : {
        type : String,
        required : true,
        trim : true
    },
    gender : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    date_of_birth : {
        type : Date,
        required : true
    },
    phone_number : {
        type : String,
        required : true
    },
    role : {
        type :String,
        default : "client"
    }
},
    { timestamps: true }
)

userSchema.plugin(mongooseUniqueValidator)
const users = new mongoose.model('users',userSchema)

export default users