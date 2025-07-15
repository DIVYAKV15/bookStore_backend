// import express because inside this library we have a class Router with the help of that we can set the path so to access it first we need to impor tthe server

// step 1
const express = require('express')

// have to import controller
const userController = require('./controller/usercontroller')
const bookController = require('./controller/bookController')
const jobController = require('./controller/jobController')

const jobApplicationController = require('./controller/jobApplicationController')

// import middleware

// middleware to verify the token before moving to controller so we need to break the req 
const jwt = require('./middleware/jwtMiddleware')


// to upload the content we need multer middleware

const multerConfiq = require('./middleware/multerMiddleware')

const pdfMulterConfiq = require('./middleware/pdfMulterMiddleware')

// step 2

// as its a class we have to create the instance and access the Post,get,put,delete method
// instance 

const routes = new express.Router()

//path to  register a user

//first we have to  register a user so have to set a path
//first have to pass the path to reslove the logic and then call back  function how  to resolve the logic(controller name)

routes.post('/register', userController.registerController)


// for login path 
routes.post('/login', userController.loginController)

// path to google login


routes.post('/google-login', userController.googleLoginController)

// path to get allhome books

routes.get('/home-book', bookController.homeBookController)

// path to get all job for both admin and use

routes.get('/all-jobs', jobController.getAllJobController)

// path to edit the profile
// eventhough we specify in path it will not active
// only it get active when there is uploded image
routes.put('/edit-profile', jwt, multerConfiq.single('profile'), userController.updateProfileController)

// ---------------------USER-----------------

// path to add book


// frontend nu path addbook anaekil addBookController leki pass cheyanam 
// before moving to logic of addBookController we have to verify whether the user is properly authenticated aano nu veriyfy cehyanam 
// after the path we have to break the req,res flow for that we use middleware 
// usually we know 2 predefined middleware expressServer.json() and defaults in json server 
// here we going to create own middleware (jwt - router specific) to verify the token before moving to controller so we need to break the req
// next  multerConfiq means to store the uploaded content in 
// in this jwt and token to verify we receive the userMail in req.payload key 

routes.post('/add-book', jwt, multerConfiq.array('uploadImages', 3), bookController.addBookController)


// to gell all books -user

routes.get('/all-books-user', jwt, bookController.getAllBookUserController)

// to view book

// :id -> : (colon) is because its a parameter

routes.get('/view-book/:id', bookController.viewBookController)

//path to get user added  book  details

routes.get('/all-user-added-books', jwt, bookController.getUserAddedBooksController)

// path to get user purchased book details

routes.get('/all-user-purchased-books', jwt, bookController.getAllUserPurchasedBooksController)

// path to delete book

routes.delete('/delete-book/:id', bookController.deleteABookController)

// path to ad job application

routes.post('/add-application', jwt, pdfMulterConfiq.single('resume'), jobApplicationController.addJobApplicationController)

// path to make a payment 

routes.put('/make-payment', jwt, bookController.paymentController)




// ------------------ADMIN------------------------



// path to get all the books
routes.get('/all-books', bookController.getAllBookControllerAdmin)

// path to approve the book

routes.put('/approve-book/:id', bookController.approveBookController)

// path to get all users

routes.get('/all-users', userController.getAllUsersController)

// path to add new job

routes.post('/add-job', jobController.addJobController)

// path to delete a job

routes.delete('/delete-job/:id', jobController.deleteAJobController)


// path to get all applied job application

routes.get('/all-application', jobApplicationController.getAllJobApplication)

// as only index.js only running we have to connect this file with that so for that we have export that
module.exports = routes


