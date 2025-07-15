// import dotenv module  and call the config ()
require('dotenv').config()// to load the env variable  
// or we add give in varaible and use like this but we dont have any use of this variable thats why we directly import it like above
// const dotenv=require('dotenv')
// dotenv.config()

//import server
const expressServer = require('express')

// import cors to connect the frontend and backend
const cors = require('cors')

// import the routes
const routes = require('./routes')

// import connection file
require('./connection')


// create server
const bookStoreServer = expressServer()

// own -> it will send the res -> hellowRold
// bookStoreServer.get('/',(req,res)=>{res.send("hello world")})
// now frontend has the ability to connect with server
// order is important 1) cors 2) json 3) routes
bookStoreServer.use(cors())

// as the data passing in json from frontend to backend ..we have to parse the json data
bookStoreServer.use(expressServer.json())

//returns middlewaare that parse only json  
// why we parsing then only we get in js format so that we can do the logical operation
// now data has been received 
// as we are following the MVC architechture
// after this logic will be in controller but here to resolve this logic will be determined by router 
// so for that we have to create a file -> routes.js
bookStoreServer.use(routes)

// when user uploaded some images it is stored in imgUpload folder in backend so we have to bring that in browser
// so to use this folder in frontend we have to export this folder 
// so to export this folder expressServer.static () method have to use
// exporting as a upload name (any name we can be given)
// whatever the name we are using to export :http://localhost:5175/uploads/Image-pexels-pixabay-301599.jpg

//export the uploads folder from the server side
// pass the argument 1st one the path which we use in frontend to invoke the image
bookStoreServer.use('/uploads', expressServer.static('./imageUploads'))

bookStoreServer.use('/pdfUpload', expressServer.static('./pdfUpload'))



// create port
const PORT = 4000 || process.env.PORT
// listen to the port to accept request
bookStoreServer.listen(PORT, () => {
    console.log(`server running successfully at port number : ${PORT}`)
})