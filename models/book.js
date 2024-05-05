import mongoose from "mongoose"

const booksSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true
    },
    author : {
        type : String,
        required : true
    },
    genre : {
        type : String,
        required : true
    },
    star_rating : {
        type : Number,
        required : true
    },
    published : {
        type : Date,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    language : {
        type : String,
        required : true
    },
    image : {
        type : String,
        default : null
    },
    isDeleted : {
        type: Boolean,
        default : false
    }
},
    { timestamps: true }
)

const books = new mongoose.model('books',booksSchema)

export default books