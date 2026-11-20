import Mentor from '../models/Mentor.js';
import MentorshipRequest from '../models/MentorshipRequest.js';
import SuccessStory from '../models/SuccessStory.js';
import ForumPost from '../models/ForumPost.js';

// --- MENTORS ---

export const getMentors = async (req, res, next) => {
  try {
    const { expertise } = req.query;
    const filter = {};
    if (expertise) {
      filter.expertise = expertise;
    }

    const mentors = await Mentor.find(filter).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: mentors.length,
      data: mentors,
    });
  } catch (err) {
    next(err);
  }
};

export const getMentorById = async (req, res, next) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found.' });
    }
    res.status(200).json({ success: true, data: mentor });
  } catch (err) {
    next(err);
  }
};

// --- MENTORSHIP REQUESTS (Protected & Scoped to user) ---

export const requestMentorship = async (req, res, next) => {
  try {
    const { mentorName, topic, message, preferredTime } = req.body;

    if (!mentorName || !topic || !message) {
      return res.status(400).json({
        success: false,
        message: 'Mentor name, topic, and message are required.',
      });
    }

    const newRequest = await MentorshipRequest.create({
      user: req.user._id,
      mentorName,
      topic,
      message,
      preferredTime: preferredTime || 'Flexible',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Mentorship request submitted successfully',
      data: newRequest,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyMentorshipRequests = async (req, res, next) => {
  try {
    const requests = await MentorshipRequest.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};

// --- SUCCESS STORIES ---

export const getSuccessStories = async (req, res, next) => {
  try {
    const stories = await SuccessStory.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (err) {
    next(err);
  }
};

// --- FORUMS ---

export const getForumPosts = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }

    const posts = await ForumPost.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

export const getForumPostById = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Forum post not found.' });
    }
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

export const createForumPost = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.',
      });
    }

    const post = await ForumPost.create({
      user: req.user._id,
      author: req.user.name,
      role: req.user.careerBreak?.targetRole || 'Returner Candidate',
      avatar: req.user.avatar || '',
      category: category || 'Career Restart Advice',
      title,
      content,
      cheers: 0,
      cheeredBy: [],
      replies: [],
    });

    res.status(201).json({
      success: true,
      message: 'Discussion topic posted successfully',
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

export const replyToForumPost = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reply text cannot be empty.',
      });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Forum post not found.' });
    }

    const newReply = {
      user: req.user._id,
      author: req.user.name,
      text: text.trim(),
    };

    post.replies.push(newReply);
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

export const cheerForumPost = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Forum post not found.' });
    }

    const userIdStr = req.user._id.toString();
    const alreadyCheered = post.cheeredBy.some((id) => id.toString() === userIdStr);

    if (alreadyCheered) {
      // Remove cheer
      post.cheeredBy = post.cheeredBy.filter((id) => id.toString() !== userIdStr);
      post.cheers = Math.max(0, post.cheers - 1);
    } else {
      // Add cheer
      post.cheeredBy.push(req.user._id);
      post.cheers += 1;
    }

    await post.save();

    res.status(200).json({
      success: true,
      cheers: post.cheers,
      hasCheered: !alreadyCheered,
    });
  } catch (err) {
    next(err);
  }
};
