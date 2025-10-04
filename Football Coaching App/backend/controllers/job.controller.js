import Job from '../models/job.model.js';

export const createJob = async (req, res) => {
  try {
    const { title, description, budget, deadline, location } = req.body;
    const job = new Job({ title, description, budget, deadline, location, postedBy: req.user.id });
    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'firstName surname');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'firstName surname');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
