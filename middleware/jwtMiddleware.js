// routes

// ------
const jwt = require('jsonwebtoken')

const jwtMiddleware = (req, res, next) => {
    // to check whether we came to midleware so log it
    // inside req from frontend header key has reqHeader value
    // reqHeader object has Authorization key 
    // in frontend we are sending the value in Authorization key but in backend it is authorization key 
    console.log('inside jwtmiddleware')
    // have to access the token but we dont want bearer here 
    //slice(7)  removes the first 7 characters 
    const token = req.headers["authorization"].split(' ')[1]
    // or
    // const token=req.headers["authorization"].slice(7)
    // to see what is inside the req.headers

    try {
        const jwtResponse = jwt.verify(token, process.env.JWTSECRETKEY)
        console.log('the response is',jwtResponse)
        // op:{ userEmail: 'jhon@gmail.com', iat: 1750662396 }
        // because while token we embeded the userEmail 
        // iat -token issued time -issued at - in milliseconds
        // userMail nae requestinte payload il set cheynu 
        // payload key can be any name
        // why we are assinging the userMail as its unique and to check whether the same user already added the same book
        // so we sharing this data 
        req.payload = jwtResponse.userEmail
        next()
    } catch (error) {
        res.status(401).json('Authorization failed', error)
    }
    // console.log(token)

}
module.exports = jwtMiddleware