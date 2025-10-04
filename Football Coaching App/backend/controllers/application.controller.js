import Application from '../models/application.model.js';
import Job from '../models/job.model.js';

export const applyJob = async (req, res) => {
  try {
    const { jobId, proposedBudget, proposedDeadline, coverLetter } = req.body;
    const application = new Application({
      job: jobId,
      applicant: req.user.id,
      proposedBudget,
      proposedDeadline,
      coverLetter
    });
    await application.save();
    await Job.findByIdAndUpdate(jobId, { $push: { applications: application._id } });
    res.status(201).json({ message: 'Applied successfully', application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ job: jobId }).populate('applicant', 'firstName surname');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
