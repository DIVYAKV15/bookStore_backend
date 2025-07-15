
const users = require("../model/userModel")
const jwt = require("jsonwebtoken")


// register logic 
exports.registerController = async (req, res) => {

    // logic
    // from the frontend 3 input field is there when the user register these 3 will be send to db  has been given so that request will sent in body

    // destructuring

    const { username, password, email } = req.body
    console.log(username, password, email)
    // once the datas are received successfully  request received will be sent to postman abd we can see the given data jhere as we consoling in above 
    // res.status(200).json('request received')
    // error  might happen so using try and catch block
    try {
        // step 1: first have to check user is already exist or not 
        // users is our model name where we have strucutre to store 
        // finedOne is a method used in mongodb to check that one user is present or not
        // key : email (from users) and  value (email) from the req.body 
        // as both key and value are same name so kust using email 
        const existingUSer = await users.findOne({ email })
        // the op will be either document if its a document then user is already present if its null then can register the user
        // if its true
        if (existingUSer) {
            // then setting the 406 as considering this as error and sending it to frontend in json format
            res.status(406).json('user already exist')
        } else {
            // or else 
            // create a instance of new user using users class 
            // and key is from userModel and value is from frontend 
            // as both key and value are same 
            // just mentioning as username

            // this is to server
            const newUser = new users({
                username,
                email,
                password
                // already in structure we gave bio and profile default so it automatically store
                // or else we have to add this 
                // bio=""
                // profile=""
            })
            // using save method we are adding the newUser in mongoDb atlas
            await newUser.save()
            // sending success response in 200 
            res.status(200).json(newUser)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


// login 
exports.loginController = async (req, res) => {
    // while login just we need email and password so just destructure that from body of request
    const { email, password } = req.body
    console.log(email, password)

    // logic
    try {
        const existingUser = await users.findOne({ email })
        // findOne fetch the email and
        // findone return document (i.e object)
        // if its return document then user is present ,or else null
        console.log(existingUser) //for own testing purpose 
        if (existingUser) {
            if (existingUser.password == password) {
                // token key generator
                // When user logs in, you generate JWT (JSON Web Token).
                // That token holds user info like email/id(which is unique for each user), signed using a secret key.
                // This token is sent to frontend.
                // In future requests, the frontend sends this token in the header.
                // The backend checks the token. If valid, the user is authenticated
                // either can give secretkey here directly 'secrekey'
                // or else if dont want to expose it directly here can give in .env 
                const token = jwt.sign({ userEmail: existingUser.email }, process.env.JWTSECRETKEY)
                // have to pass this token to front end
                // so has it 2 things to send so share it as object
                // res.status(200).json(existingUser)
                // either existingUser:use,token:token -> if key and value name are differnt can give in different way or else give in same like below
                res.status(200).json({ existingUser, token })
            } else {
                res.status(403).json('Invalid credentials')
            }

        } else {
            res.status(406).json('user doesnot exist,please register')
        }
    } catch (error) {
        res.status(500).json(error)
    }



}

// google login 


// google will take care of the email and password match logic 
// first we have to check its existing user 
// or else we ahve to regeister the details also in. google login
// then store the token ->token holds user info like email/id(which is unique for each user), signed using a secret key.
// so we need the unique token 


exports.googleLoginController = async (req, res) => {
    // destructuring from the frontend so in frontend also the key must be same
    const { username, email, password, photo } = req.body
    console.log(username, email, password, photo)
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            const token = jwt.sign({ userEmail: existingUser.email }, process.env.JWTSECRETKEY)
            res.status(200).json({ existingUser, token })
        } else {
            const newUser = new users({
                username,
                email,
                password,
                profile: photo
            })
            await newUser.save()
            const token = jwt.sign({ userEmail: newUser.email }, process.env.JWTSECRETKEY)

            res.status(200).json({ existingUser: newUser, token })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// update the profile 


// to update the profile we need the usermail so do get that we are passing through jwt

exports.updateProfileController = async (req, res) => {
    const userEmail = req.payload
    console.log(userEmail)
    // destructuring from the user model
    const { username, password, bio, profile } = req.body
    console.log(username, password, bio, profile)
    // 3 cases here
    // either the user will not upload is profile image 
    // or already uploded profile image edited 
    // or uploading the user image for first time
    // so if its uploaded image it has to pass through multer middleware 
    // so in multer middleware we can see the uploaded image only through req.file not in req.body 
    // so if its empty req.file? then multer will not be active 
    // if its going to be added profile then req.file.filename nae edudhuthu pro variable il set cheyyam
    // or already uploaded checythutu enkil then it will be there in profile key so from the key keep the data in pro varibale 


    // If req.file exists (i.e., a file was uploaded), then set pro to the uploaded file's filename.
    // Else, use the existing profile value.

    pro = req.file ? req.file.filename : profile

    try {
        //instead of updateOne we are using findOneAndUpdate const updateProfile = await users.updateOne 
        // updateOne  its defaultly return the new doc 
        // but in findOneAndUpdate we have to set new: {true}
        const updateProfile = await users.findOneAndUpdate({ email: userEmail },
            {
                username,
                email: userEmail,
                password,
                bio,
                profile: pro
            }, { new: true })
        res.status(200).json(updateProfile)

    } catch (error) {
        res.status(500).json(error)
    }
}


// --------ADMIN---------

// get all users 

exports.getAllUsersController = async (req, res) => {
    // we should need to get all the users so that admin can see the users list but admin details should be excluded
    const query = {
        email: {
            $ne: 'boostoreadmin@gmail.com'
        }
    }
    try {
        const allUsers = await users.find(query)
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json(error)
    }
}