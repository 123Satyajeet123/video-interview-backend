const Job = require("../models/Job");

// Controller to create a new job
const createJob = async (req, res) => {
    try {
        const { title, description, requirements, company } = req.body;

        // Create a new job
        const job = new Job({ title, description, requirements, company });
        await job.save();

        res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
        res.status(500).json({ message: "Error creating job", error: error.message });
    }
};

// Controller to get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
};

// Controller to get a job by ID
const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: "Error fetching job", error: error.message });
    }
};

// Controller to update a job by ID
const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, requirements, company } = req.body;

        const job = await Job.findByIdAndUpdate(
            id,
            { title, description, requirements, company },
            { new: true, runValidators: true }
        );

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({ message: "Job updated successfully", job });
    } catch (error) {
        res.status(500).json({ message: "Error updating job", error: error.message });
    }
};

// Controller to delete a job by ID
const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findByIdAndDelete(id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting job", error: error.message });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
};