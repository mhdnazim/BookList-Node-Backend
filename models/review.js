import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({

    user : {
        ref: "users",
        type: mongoose.Schema.Types.ObjectId,
        required : true
    },
    book : {
        ref : "books",
        type: mongoose.Schema.Types.ObjectId,
        required : true
    },
    rating : {
        type : Number,
        required : true
    },
    review : {
        type : String,
        required : true
    }
},
    { timestamps: true }
)

const reviews = new mongoose.model('reviews',reviewSchema)

export default reviews