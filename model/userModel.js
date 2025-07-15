// import mongoose
const mongoose = require('mongoose')
// schema means model
// accessing the schema class from mongoose
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true // required: true means it must be provided
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: '' //if user didnt type any value then the default value will be shown
    },
    profile: {
        type: String,
        default: ''
    },
    //  role: {
    //     type: String,
    //     default: 'user'
    // },
})




// collection name(db->collection) - > users which given in mongodb atlas under bookstore db either we can already create there or it will automatically created once we gave her
// have to pass that collection name 
// schema -> model to store the data 

const users = mongoose.model('users', userSchema)// create model using schema and collection name 'users'

module.exports = users
