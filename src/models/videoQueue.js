const mongoose = require('mongoose');

const videoQueueSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true
  },
  videos: [
    {
      videoUrl: {
        type: String,
        required: true
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model('VideoQueue', videoQueueSchema);
