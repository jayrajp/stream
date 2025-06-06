const { v4: uuidv4 } = require('uuid');
const { pool } = require('../database/init');
const { validationResult } = require('express-validator');

/**
 * Create a new channel
 */
const createChannel = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description } = req.body;
    const ownerId = req.user.id;
    const channelId = uuidv4();

    const insertQuery = `
      INSERT INTO channels (id, name, description, owner_id)
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(insertQuery, [channelId, name, description, ownerId]);

    return res.status(201).json({
      success: true,
      message: 'Channel created successfully',
      data: { id: channelId, name, description, owner_id: ownerId },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get all channels
 */
const getAllChannels = async (req, res) => {
  try {
    const { rows: channels } = await pool.query('SELECT * FROM channels');
    return res.status(200).json({ success: true, count: channels.length, data: channels });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get channels by user ID
 */
const getUserChannels = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows: channels } = await pool.query('SELECT * FROM channels WHERE owner_id = $1', [userId]);
    return res.status(200).json({ success: true, count: channels.length, data: channels });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get channel by ID
 */
const getChannelById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM channels WHERE id = $1', [id]);
    const channel = rows[0];

    if (!channel) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    return res.status(200).json({ success: true, data: channel });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Update channel
 */
const updateChannel = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    const { rows } = await pool.query('SELECT * FROM channels WHERE id = $1', [id]);
    const channel = rows[0];

    if (!channel) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    if (channel.owner_id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this channel' });
    }

    await pool.query(
      'UPDATE channels SET name = $1, description = $2 WHERE id = $3',
      [name, description, id]
    );

    return res.status(200).json({
      success: true,
      message: 'Channel updated successfully',
      data: { id, name, description, owner_id: userId },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Delete channel
 */
const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { rows } = await pool.query('SELECT * FROM channels WHERE id = $1', [id]);
    const channel = rows[0];

    if (!channel) {
      return res.status(404).json({ success: false, message: 'Channel not found' });
    }

    if (channel.owner_id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this channel' });
    }

    await pool.query('DELETE FROM channels WHERE id = $1', [id]);

    return res.status(200).json({ success: true, message: 'Channel deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createChannel,
  getAllChannels,
  getUserChannels,
  getChannelById,
  updateChannel,
  deleteChannel,
};
