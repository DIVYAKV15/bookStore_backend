// add job

const jobs = require("../model/jobModel")

exports.addJobController = async (req, res) => {
    // we get the data from input box from front end so just destructure it 

    const { title, location, jtype, salary, qualification, experience, description } = req.body

    console.log(title, location, jtype, salary, qualification, experience, description)

    try {
        // some company the have id for each job in that case we can search with id to find already this job is posted or not

        const existingJobs = await jobs.findOne({ title, location })
        if (existingJobs) {
            res.status(400).json('Job ALready Added')
        } else {
            // key is from model and value is from the above destructured as we have both name same so just adding one
            const newJobs = new jobs({
                title, location, jtype, salary, qualification, experience, description
            })
            await newJobs.save()
            res.status(200).json(newJobs)
        }


    } catch (error) {
        res.status(500).json(error)
    }

}

// get all jobs

exports.getAllJobController = async (req, res) => {
    // destructuring the key from the request query
    const { search } = req.query
    console.log(search)
    try {
        const allJobs = await jobs.find({
            title: {
                $regex: search, $options: 'i'

            }
        })
        res.status(200).json(allJobs)
    } catch (error) {
        res.status(500).json(error)
    }
}

// delete job

exports.deleteAJobController = async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        // can use findOneAndDelete(same passing id)
      
         await jobs.findByIdAndDelete({ _id: id })
        res.status(200).json('Deleted a job')
    } catch (error) {
        res.status(500).json(error)
    }
}