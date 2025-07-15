const multer = require('multer')
// to store the uploaded  files 
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './pdfUpload')
    },
    filename: (req, file, callback) => {
        callback(null, `resume-${file.originalname}`)
    }
})

// pdf,doc,ppt files can uploded here it should nt be png,img,jpeg files only uploaded here 
// so this logic has to be done by server using fileFilter
// while uploading the images we get the type name also if we console we can see that 
// frontend il type key il aanu we can see the type of the image backend il mimetype
const fileFilter = (req, file, callback) => {
    if (file.mimetype == 'application/pdf' ) {
        callback(null, true) //accept this file so gave true

    } else {
        callback(null, false) //reject those files so gave false and if its not the accepted format then error has to throw to the user regrading the issue so return the error
        return callback(new Error('only accept pdf file format'))
    }
}
// inside the multer : storage key : storage name
//  here both storage key and value name are same so just gave storage
// again same for fileFilter 
const pdfMulterConfiq = multer({
    storage,
    fileFilter
})
// a
module.exports=pdfMulterConfiq
// given as arrow function instead of regular function 
//  filename:(req,file,callback)=>{
// callback(null,`Image-${file.originalname}`)
// }

// null means error onum illya enkil store as image - file name
// when we upload the image in fronend and when we console it its key name as : divya.img /sunrise.img
// but in backend the name key will be in originl key 
