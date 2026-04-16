const express = require('express');
const router = express.Router();
const { getProblems, getTopics, updateProblemStatus } = require('../controllers/problemController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getProblems);
router.get('/topics', authMiddleware, getTopics);
router.patch('/:problemId/status', authMiddleware, updateProblemStatus);

module.exports = router;
