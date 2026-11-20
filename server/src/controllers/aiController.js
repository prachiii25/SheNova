import {
  generateRoadmap,
  analyzeSkillGap,
  improveResume,
  explainCareerGap,
  generateInterviewQuestions,
  evaluateAnswer,
  recommendCourses,
} from '../services/geminiService.js';

export const handleGenerateRoadmap = async (req, res, next) => {
  try {
    const result = await generateRoadmap(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const handleAnalyzeSkillGap = async (req, res, next) => {
  try {
    const result = await analyzeSkillGap(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const handleImproveResume = async (req, res, next) => {
  try {
    const result = await improveResume(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const handleExplainCareerGap = async (req, res, next) => {
  try {
    const result = await explainCareerGap(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const handleGenerateInterviewQuestions = async (req, res, next) => {
  try {
    const result = await generateInterviewQuestions(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const handleEvaluateAnswer = async (req, res, next) => {
  try {
    const result = await evaluateAnswer(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const handleRecommendCourses = async (req, res, next) => {
  try {
    const result = await recommendCourses(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
