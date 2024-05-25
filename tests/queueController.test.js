 
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

const queueRoutes = require('../src/routes/queueRoutes');
app.use('/api', queueRoutes);

beforeAll(async () => {
  // Verbindung zur Testdatenbank herstellen
  await mongoose.connect('mongodb://localhost:27017/videoQueueTest', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Verbindung zur Testdatenbank trennen
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Video Queue API', () => {
  it('should add a video to the queue', async () => {
    const response = await request(app)
      .post('/api/room123/queue')
      .send({ videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });
    expect(response.statusCode).toBe(201);
    expect(response.body.videos).toHaveLength(1);
  });

  it('should get the video queue', async () => {
    const response = await request(app)
      .get('/api/room123/queue');
    expect(response.statusCode).toBe(200);
    expect(response.body.videos).toHaveLength(1);
  });

  it('should not add a duplicate video to the queue', async () => {
    const response = await request(app)
      .post('/api/room123/queue')
      .send({ videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Video already exists in the queue');
  });

  it('should not add an invalid URL to the queue', async () => {
    const response = await request(app)
      .post('/api/room123/queue')
      .send({ videoUrl: 'invalid-url' });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe('Invalid video URL');
  });

  it('should remove a video from the queue', async () => {
    const queueResponse = await request(app)
      .get('/api/room123/queue');
    const videoId = queueResponse.body.videos[0]._id;
    
    const response = await request(app)
      .delete('/api/room123/queue')
      .send({ videoId });
    expect(response.statusCode).toBe(200);
    expect(response.body.videos).toHaveLength(0);
  });
});
