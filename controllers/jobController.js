const Job = require("../models/Job/Job");

// Controller to create a new job
const createJob = async (req, res) => {
    try {
        const { title, description, requirements, company } = req.body;

        // Validate required fields
        if (!title || !description || !company) {
            return res.status(400).json({
                error: 'Missing Required Fields',
                message: 'title, description, and company are required'
            });
        }

        // Create a new job
        const job = new Job({ title, description, requirements, company });
        await job.save();

        res.status(201).json({ 
            message: "Job created successfully", 
            job 
        });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ 
            error: 'Job Creation Failed',
            message: "Error creating job", 
            details: error.message 
        });
    }
};

// Controller to get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json({
            message: "Jobs retrieved successfully",
            count: jobs.length,
            jobs
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ 
            error: 'Job Retrieval Failed',
            message: "Error fetching jobs", 
            details: error.message 
        });
    }
};

// Controller to get a job by ID
const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate job ID
        if (!id) {
            return res.status(400).json({
                error: 'Missing Job ID',
                message: 'Job ID is required'
            });
        }

        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ 
                error: 'Job Not Found',
                message: "Job not found" 
            });
        }

        res.status(200).json({
            message: "Job retrieved successfully",
            job
        });
    } catch (error) {
        console.error("Error fetching job:", error);
        res.status(500).json({ 
            error: 'Job Retrieval Failed',
            message: "Error fetching job", 
            details: error.message 
        });
    }
};

// Controller to update a job by ID
const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, requirements, company } = req.body;

        // Validate job ID
        if (!id) {
            return res.status(400).json({
                error: 'Missing Job ID',
                message: 'Job ID is required'
            });
        }

        const job = await Job.findByIdAndUpdate(
            id,
            { title, description, requirements, company },
            { new: true, runValidators: true }
        );

        if (!job) {
            return res.status(404).json({ 
                error: 'Job Not Found',
                message: "Job not found" 
            });
        }

        res.status(200).json({ 
            message: "Job updated successfully", 
            job 
        });
    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({ 
            error: 'Job Update Failed',
            message: "Error updating job", 
            details: error.message 
        });
    }
};

// Controller to delete a job by ID
const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate job ID
        if (!id) {
            return res.status(400).json({
                error: 'Missing Job ID',
                message: 'Job ID is required'
            });
        }

        const job = await Job.findByIdAndDelete(id);
        if (!job) {
            return res.status(404).json({ 
                error: 'Job Not Found',
                message: "Job not found" 
            });
        }

        res.status(200).json({ 
            message: "Job deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ 
            error: 'Job Deletion Failed',
            message: "Error deleting job", 
            details: error.message 
        });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
};