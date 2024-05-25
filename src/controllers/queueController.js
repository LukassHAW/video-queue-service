const VideoQueue = require('../models/videoQueue');
const { body, validationResult } = require('express-validator');

exports.getQueue = async (req, res) => {
  try {
    const queue = await VideoQueue.findOne({ roomId: req.params.roomId });
    if (!queue) return res.status(404).send('Room not found');
    res.status(200).json(queue);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.addToQueue = [
  body('videoUrl').isURL().withMessage('Invalid video URL'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { videoUrl } = req.body;
      let queue = await VideoQueue.findOne({ roomId: req.params.roomId });

      if (!queue) {
        queue = new VideoQueue({ roomId: req.params.roomId, videos: [] });
      }

      const videoExists = queue.videos.some(video => video.videoUrl === videoUrl);
      if (videoExists) {
        return res.status(400).send('Video already exists in the queue');
      }

      queue.videos.push({ videoUrl });
      await queue.save();
      res.status(201).json(queue);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
];

exports.removeFromQueue = async (req, res) => {
  try {
    const { videoId } = req.body;
    const queue = await VideoQueue.findOne({ roomId: req.params.roomId });

    if (!queue) return res.status(404).send('Room not found');

    queue.videos = queue.videos.filter(video => video._id.toString() !== videoId);
    await queue.save();
    res.status(200).json(queue);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
