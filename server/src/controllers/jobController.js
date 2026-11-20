import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';
import SavedJob from '../models/SavedJob.js';

export const getJobs = async (req, res, next) => {
  try {
    const { search, type, workMode, location, experience } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (type && type !== 'All') query.type = type;
    if (workMode && workMode !== 'All') query.workMode = workMode;
    if (location && location !== 'All') query.location = { $regex: location, $options: 'i' };
    if (experience && experience !== 'All') query.experience = experience;

    const jobs = await Job.find(query).sort({ matchScore: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

export const applyForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    // Check duplicate
    const existing = await JobApplication.findOne({ user: req.user._id, job: job._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this returnship position.',
      });
    }

    const application = await JobApplication.create({
      user: req.user._id,
      job: job._id,
      candidateDetails: {
        fullName: req.body.fullName || req.user.name,
        email: req.body.email || req.user.email,
        phone: req.body.phone || req.user.phone || '+91 98765 43210',
        breakStatement: req.body.breakStatement || 'Career pause reframed with continuous upskilling.',
        coverNote: req.body.coverNote || '',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully with your SheNova Returner Profile',
      data: application,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find({ user: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    next(err);
  }
};

export const toggleSaveJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const existing = await SavedJob.findOne({ user: req.user._id, job: job._id });

    if (existing) {
      await SavedJob.findByIdAndDelete(existing._id);
      return res.status(200).json({
        success: true,
        message: 'Job removed from your saved bookmarks',
        saved: false,
      });
    }

    await SavedJob.create({ user: req.user._id, job: job._id });
    res.status(200).json({
      success: true,
      message: 'Job saved to your bookmarks',
      saved: true,
    });
  } catch (err) {
    next(err);
  }
};

export const getMySavedJobs = async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ user: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: saved.length,
      data: saved.map((s) => s.job).filter(Boolean),
    });
  } catch (err) {
    next(err);
  }
};
