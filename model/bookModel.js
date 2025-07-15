const mongoose = require('mongoose')

const bookschema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    noOfPages: {
        type: Number,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    dprice: {
        type: Number,
        required: true
    },
    abstract: {
        type: String,
        required: true
    },
    uploadImages: {
        type: Array,
        required: true
    },
    // to come to know which user added the book so while adding we are storing the user mail also

    userEmail: {
        type: String,
        required: true
    },
    // when the user add the book initially it wil be pending after the admin clicks its approved
    status: {
        type: String,
        default: "pending"
    },
    // broughtby key is to get to know who brought the book 
    BroughtBy: {
        type: String,
        default: ""
    }

})
// create model using Schema class and collection name 'books' in atlas
const books = mongoose.model('books', bookschema)
module.exports = books