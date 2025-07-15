// to connect our db and server we already installed library called mongoose
const mongoose = require('mongoose')
const connectionString = process.env.DATABASE //accessing the environment variable
// connection 
mongoose.connect(connectionString).then(() => { //connect method return a promise as its a asynchronous operation time delay will be there it has to connect with mongo db atlas so it reutrn promise
    console.log('mongodb connected successfully') //we dont need to see the then((res)) just we want to know th connection successfully or not so postive respone from promise method can see in then() and negative method in catch 
}).catch((err) => {
    console.log(`mongo db connection failed due to :${err}`)
})