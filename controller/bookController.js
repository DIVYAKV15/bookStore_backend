const books = require('../model/bookModel');
// const { rawListeners } = require('../model/userModel');
const stripe = require('stripe')(process.env.STRIPESECRETKEY)


// to add a book 
exports.addBookController = async (req, res) => {
    //console.log(req)
    // req is an object ..lots aof key value pairs only we set few like method ,url,body,headers
    //logic
    const { title, author, publisher, language, noOfPages, isbn, imageUrl, category, price, dprice, abstract } = req.body
    //  1)   The body object contains the values of the text fields of the form,thats why req.body il text field nte content 
    // 2) the file or files object contains the files uploaded via the form.(uploaded cheythtu illa files-> files )
    console.log(req.files);
    //output:fieldname: 'uploadImages',
    // originalname: 'pexels-pixabay-301599.jpg',
    // encoding: '7bit',
    // mimetype: 'image/jpeg',
    // destination: './imageUploads',
    // filename: 'Image-pexels-pixabay-301599.jpg',
    // path: 'imageUploads/Image-pexels-pixabay-301599.jpg',
    // size: 508015
    console.log(req.payload)
    // ------
    // user should not add same book other user can add this book but same user should not add the same book 
    try {
        const existingBook = await books.findOne({ title, userMail: req.payload })
        if (existingBook) {
            res.status(406).json('Book Already Exist')
        } else {
            const newBook = new books({
                title, author, publisher, language, noOfPages, isbn, imageUrl, category, price, dprice, abstract, uploadImages: req.files, userEmail: req.payload
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    } catch (error) {
        res.status(500).json(error)
    }


}

// to get home books
// last added book should show first
exports.homeBookController = async (req, res) => {
    try {
        const allHomeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(allHomeBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

// to get all books from userside 

exports.getAllBookUserController = async (req, res) => {
    // const result=req.query
    // console.log(result) op:{ search: 'gi' }
    // instead of setting in variable we are destructuring the value from the key 
    const { search } = req.query
    console.log(search) //op:g

    // user added book should not show n the page because user is not goong to buy the book which he added
    // so for that in model while adding the book we are storing the email id also 
    // so show the book whichis not equal to the same user mail id
    // in jwt -> in req.payload we are setting the userEmail so 
    const userEmail = req.payload


    try {
        const query = {
            // $regex: the pattern to search for (can be a string or RegExp object).

            // $options: "i": makes it case-insensitive
            title: {
                $regex: search, $options: "i"
            },
            userEmail: {
                // $ne stands for "Not Equal" in mongoDb operation
                // This query is saying:

                // Find all documents where the value of the userEmail field is not equal to the value of the userEmail variable.
                $ne: userEmail
            }
        }
        const allBookUser = await books.find(query)
        res.status(200).json(allBookUser)
    }
    catch (error) {
        res.status(500).json(error)
    }
}


// to fetch a particular book to view the book

exports.viewBookController = async (req, res) => {
    // we have to view depend upon the id 
    // destructuring the id from routes id we are passing as parameter from there
    // we can get the id only from req.params object
    const { id } = req.params
    console.log('the id is ' + id)

    try {
        const specificBook = await books.find({ _id: id })
        res.status(200).json(specificBook)

    } catch (error) {
        res.status(500).json(error)
    }
}

// to get all user added books only 


exports.getUserAddedBooksController = async (req, res) => {
    const userEmail = req.payload

    try {
        const allUserBooks = await books.find({ userEmail })
        res.status(200).json(allUserBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get all user purchased book 
exports.getAllUserPurchasedBooksController = async (req, res) => {
    const userEmail = req.payload
    console.log('inside the controller')
    try {
        const allUserPurchasedBooks = await books.find({ userEmail })

        res.status(200).json(allUserPurchasedBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

// to delete a particular book

exports.deleteABookController = async (req, res) => {
    const { id } = req.params
    console.log(id);
    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json('deleted')
    }
    catch (error) {
        res.status(500).json(error)
    }
}

// make a payement controller

exports.paymentController = async (req, res) => {
    // we need to know which user is buying so we can take that from jwt 

    const email = req.payload
    console.log('email for buy', email)
    // in that bookdetails key we are sending the dats from frontend
    const { bookDetails } = req.body
    console.log(bookDetails)
    try {
        // to update the db in mongodb while purchasing
        // ethu book nae aanu vangunu ah book nae kuda venam 
        const existingBook = await books.findByIdAndUpdate(bookDetails.id, {

            title: bookDetails.title,
            author: bookDetails.author,
            publisher: bookDetails.publisher, language: bookDetails.language, noOfPages: bookDetails.noOfPages,
            isbn: bookDetails.isbn,
            imageUrl: bookDetails.imageUrl,
            category: bookDetails.category,
            price: bookDetails.price,
            dprice: bookDetails.dprice,
            abstract: bookDetails.abstract,
            uploadImages: bookDetails.uploadImages,
            userEmail: bookDetails.userEmail,
            status: 'sold',
            BroughtBy: email


        }, { new: true })
        // as its new so set new :true
        console.log(existingBook)

        // array of objects becuase we have 2 key -> price_data nd quantity  and copy the keys from the  line items in stripe
        const line_item = [{
            price_data: {
                currency: 'usd', // dollars
                product_data: {
                    name: bookDetails.title,
                    description: `${bookDetails.author} | ${bookDetails.publisher}`,
                    images: [bookDetails.imageUrl],
                    metadata: {
                        title: bookDetails.title,
                        author: bookDetails.author,
                        publisher: bookDetails.publisher, language: bookDetails.language, noOfPages: bookDetails.noOfPages,
                        isbn: bookDetails.isbn,
                        imageUrl: bookDetails.imageUrl,
                        category: bookDetails.category,
                        price: `${bookDetails.price}`,
                        dprice: `${bookDetails.dprice}`,
                        abstract: bookDetails.abstract.slice(0, 50),
                        // uploadImages: bookDetails.uploadImages,
                        userEmail: bookDetails.userEmail,
                        status: 'sold',
                        BroughtBy: email
                    }



                },
                // meta data expects only string and number - noa rr ay or object if we want then stringify it

                // purchase amount 
                // as the unit is cent so to convert into our amt we have to convert by multiplying with 100 and to avoid decimals we are using Math.round() 
                unit_amount: Math.round(bookDetails.dprice)
            },
            quantity: 1
        }];



        // create a checkout session for stripe
        const session = await stripe.checkout.sessions.create({
            // type of payment
            payment_method_types: ['card'],
            // details of the porduct that we are purchasing
            // either we can passs the object here or store the object in variable and pass the variable here
            line_items: line_item,
            // what kind of payment miode like subscription ,if we need only one payemt then payment 
            mode: "payment",
            // where it should move once the payment is sucess
            success_url: 'http://localhost:5174/payment-success',
            // if its failure where it should move
            cancel_url: 'http://localhost:5174/payment-fail'



        })
        console.log(session)
        // we share the session id to frontend so if id present then in frontend it will redirect to payment success or failure 
        // we can send the updated details als0 but in that case its not mandatory
        console.log("Stripe session created:", session);

        res.status(200).json({ sessionId: session.id })
    } catch (error) {
        res.status(500).json(error)
    }
}

// ----------------ADMIN-----------

// to get all book 

exports.getAllBookControllerAdmin = async (req, res) => {
    try {
        const allBooks = await books.find()
        res.status(200).json(allBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

// approve book controller

exports.approveBookController = async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        const existingBooks = await books.findOne({ _id: id })
        const updatedBook = await books.findByIdAndUpdate({
            _id: id
        }, {
            title: existingBooks.title,
            author: existingBooks.author,
            publisher: existingBooks.publisher,
            language: existingBooks.language,
            noOfPages: existingBooks.noOfPages,
            isbn: existingBooks.isbn,
            imageUrl: existingBooks.imageUrl,
            category: existingBooks.category,
            price: existingBooks.price,
            dprice: existingBooks.dprice,
            abstract: existingBooks.abstract,
            uploadImages: existingBooks.uploadImages,
            userEmail: existingBooks.userEmail,
            status: 'Approved',
            BroughtBy: existingBooks.BroughtBy,
        }, { new: true })
        res.status(200).json(updatedBook)
    } catch (error) {
        res.status(500).json(error)
    }
}