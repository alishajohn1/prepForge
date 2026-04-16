const express = require('express');
const router = express.Router();
const { getDashboardStats, getHeatmap, getWeakTopics, getRevisionList } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');

router.get('/dashboard', authMiddleware, getDashboardStats);
router.get('/heatmap', authMiddleware, getHeatmap);
router.get('/weak-topics', authMiddleware, getWeakTopics);
router.get('/revision', authMiddleware, getRevisionList);

module.exports = router;
