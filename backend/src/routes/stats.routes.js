const express = require('express');
const {
  getViewerStats,
  getChatStats,
  getMoodStats,
  getCombinedStats,
  getKeywordStats
} = require('../controllers/stats.controller');

const router = express.Router();

// Get viewer stats for a stream
router.get('/viewers/:streamId', getViewerStats);

// Get chat stats for a stream
router.get('/chat/:streamId', getChatStats);

// Get mood stats for a stream
router.get('/mood/:streamId', getMoodStats);

// Get keyword stats for a stream (auto-tagging)
router.get('/keywords/:streamId', getKeywordStats);

// Get combined stats for a stream
router.get('/stream/:streamId', getCombinedStats);

module.exports = router;