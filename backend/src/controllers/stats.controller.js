const { getDatabase } = require('../database/init');

const db = getDatabase();

/**
 * Get viewer stats for a stream
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getViewerStats = (req, res) => {
  try {
    const { streamId } = req.params;

    db.get(
      `SELECT 
        COUNT(*) as total_viewers,
        SUM(CASE WHEN left_at IS NULL THEN 1 ELSE 0 END) as current_viewers,
        AVG(CASE 
          WHEN left_at IS NOT NULL 
          THEN (julianday(left_at) - julianday(joined_at)) * 24 * 60 
          ELSE (julianday('now') - julianday(joined_at)) * 24 * 60 
        END) as avg_watch_time_minutes
      FROM viewers 
      WHERE stream_id = ?`,
      [streamId],
      (err, stats) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error',
            error: err.message
          });
        }

        return res.status(200).json({
          success: true,
          data: {
            stream_id: streamId,
            total_viewers: stats.total_viewers,
            current_viewers: stats.current_viewers,
            avg_watch_time_minutes: Math.round(stats.avg_watch_time_minutes || 0)
          }
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get chat stats for a stream
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChatStats = (req, res) => {
  try {
    const { streamId } = req.params;

    db.get(
      `SELECT 
        COUNT(*) as total_messages,
        COUNT(DISTINCT viewer_id) as unique_chatters,
        (SELECT COUNT(*) FROM chat_messages WHERE stream_id = ? AND sentiment = 'positive') as positive_messages,
        (SELECT COUNT(*) FROM chat_messages WHERE stream_id = ? AND sentiment = 'negative') as negative_messages,
        (SELECT COUNT(*) FROM chat_messages WHERE stream_id = ? AND sentiment = 'neutral') as neutral_messages
      FROM chat_messages 
      WHERE stream_id = ?`,
      [streamId, streamId, streamId, streamId],
      (err, stats) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error',
            error: err.message
          });
        }

        return res.status(200).json({
          success: true,
          data: {
            stream_id: streamId,
            total_messages: stats.total_messages,
            unique_chatters: stats.unique_chatters,
            sentiment: {
              positive: stats.positive_messages,
              negative: stats.negative_messages,
              neutral: stats.neutral_messages
            }
          }
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get mood stats for a stream
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMoodStats = (req, res) => {
  try {
    const { streamId } = req.params;

    db.all(
      `SELECT 
        mood,
        COUNT(*) as count,
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM mood_logs WHERE stream_id = ?)) as percentage
      FROM mood_logs 
      WHERE stream_id = ?
      GROUP BY mood
      ORDER BY count DESC`,
      [streamId, streamId],
      (err, moodStats) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error',
            error: err.message
          });
        }

        return res.status(200).json({
          success: true,
          data: {
            stream_id: streamId,
            moods: moodStats.map(stat => ({
              mood: stat.mood,
              count: stat.count,
              percentage: Math.round(stat.percentage)
            }))
          }
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get combined stats for a stream
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCombinedStats = (req, res) => {
  try {
    const { streamId } = req.params;

    // Get viewer stats
    db.get(
      `SELECT 
        COUNT(*) as total_viewers,
        SUM(CASE WHEN left_at IS NULL THEN 1 ELSE 0 END) as current_viewers,
        AVG(CASE 
          WHEN left_at IS NOT NULL 
          THEN (julianday(left_at) - julianday(joined_at)) * 24 * 60 
          ELSE (julianday('now') - julianday(joined_at)) * 24 * 60 
        END) as avg_watch_time_minutes
      FROM viewers 
      WHERE stream_id = ?`,
      [streamId],
      (err, viewerStats) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error',
            error: err.message
          });
        }

        // Get chat stats
        db.get(
          `SELECT 
            COUNT(*) as total_messages,
            COUNT(DISTINCT viewer_id) as unique_chatters,
            (SELECT COUNT(*) FROM chat_messages WHERE stream_id = ? AND sentiment = 'positive') as positive_messages,
            (SELECT COUNT(*) FROM chat_messages WHERE stream_id = ? AND sentiment = 'negative') as negative_messages,
            (SELECT COUNT(*) FROM chat_messages WHERE stream_id = ? AND sentiment = 'neutral') as neutral_messages
          FROM chat_messages 
          WHERE stream_id = ?`,
          [streamId, streamId, streamId, streamId],
          (err, chatStats) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: 'Database error',
                error: err.message
              });
            }

            // Get mood stats
            db.all(
              `SELECT 
                mood,
                COUNT(*) as count,
                (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM mood_logs WHERE stream_id = ?)) as percentage
              FROM mood_logs 
              WHERE stream_id = ?
              GROUP BY mood
              ORDER BY count DESC`,
              [streamId, streamId],
              (err, moodStats) => {
                if (err) {
                  return res.status(500).json({
                    success: false,
                    message: 'Database error',
                    error: err.message
                  });
                }

                // Get stream info
                db.get(
                  `SELECT * FROM streams WHERE id = ?`,
                  [streamId],
                  (err, stream) => {
                    if (err) {
                      return res.status(500).json({
                        success: false,
                        message: 'Database error',
                        error: err.message
                      });
                    }

                    if (!stream) {
                      return res.status(404).json({
                        success: false,
                        message: 'Stream not found'
                      });
                    }

                    return res.status(200).json({
                      success: true,
                      data: {
                        stream_info: stream,
                        viewer_stats: {
                          total_viewers: viewerStats.total_viewers,
                          current_viewers: viewerStats.current_viewers,
                          avg_watch_time_minutes: Math.round(viewerStats.avg_watch_time_minutes || 0)
                        },
                        chat_stats: {
                          total_messages: chatStats.total_messages,
                          unique_chatters: chatStats.unique_chatters,
                          sentiment: {
                            positive: chatStats.positive_messages,
                            negative: chatStats.negative_messages,
                            neutral: chatStats.neutral_messages
                          }
                        },
                        mood_stats: {
                          moods: moodStats.map(stat => ({
                            mood: stat.mood,
                            count: stat.count,
                            percentage: Math.round(stat.percentage)
                          }))
                        }
                      }
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get keyword stats for a stream (auto-tagging)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getKeywordStats = (req, res) => {
  try {
    const { streamId } = req.params;
    const { limit = 10 } = req.query;

    db.all(
      `SELECT keyword, frequency 
       FROM keywords 
       WHERE stream_id = ? 
       ORDER BY frequency DESC 
       LIMIT ?`,
      [streamId, parseInt(limit)],
      (err, keywords) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error',
            error: err.message
          });
        }

        return res.status(200).json({
          success: true,
          data: {
            stream_id: streamId,
            keywords
          }
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getViewerStats,
  getChatStats,
  getMoodStats,
  getCombinedStats,
  getKeywordStats
};