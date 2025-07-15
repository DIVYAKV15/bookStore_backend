// to add job applying application

const jobApplication = require("../model/jobApplicationModel")

exports.addJobApplicationController = async (req, res) => {
    // destructuring from front end 
    const { jobTitle, fullname,
        qualification,
        email,
        phone,
        coverLetter,
    } = req.body

    // uploaded files get from file
    // no need to store the entire details of files in backend just store the filename 

    const resume = req.file.filename;

    console.log(resume)

    // consoling it so we can check it in backend - for debugging 

    console.log(jobTitle, fullname,
        qualification,
        email,
        phone,
        coverLetter,
        resume)

    try {

        const existingApplication = await jobApplication.findOne({ jobTitle, email })

        if (existingApplication) {
            res.status(400).json('Already applied')
        } else {
            const newApplication = new jobApplication({
                jobTitle, name: fullname, qualification, email, phone, coverLetter, resume
            })
            await newApplication.save()
            res.status(200).json({ message: "Job posted successfully" })
        }

    } catch (error) {
        res.status(500).json(error)
    }
}

// to get all applied application in admin

exports.getAllJobApplication = async (req, res) => {
    try {
        const allApplication = await jobApplication.find()
        res.status(200).json(allApplication)
    } catch (error) {
        res.status(500).json(error)
    }
}