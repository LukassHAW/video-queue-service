const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

/**
 * @swagger
 * tags:
 *   name: Queue
 *   description: The video queue managing API
 */

/**
 * @swagger
 * /api/{roomId}/queue:
 *   get:
 *     summary: Get the video queue for a room
 *     tags: [Queue]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *         description: The room ID
 *     responses:
 *       200:
 *         description: The video queue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 roomId:
 *                   type: string
 *                 videos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       videoUrl:
 *                         type: string
 *                       addedAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
router.get('/:roomId/queue', queueController.getQueue);

/**
 * @swagger
 * /api/{roomId}/queue:
 *   post:
 *     summary: Add a video to the queue
 *     tags: [Queue]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *         description: The room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: The video was added to the queue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 roomId:
 *                   type: string
 *                 videos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       videoUrl:
 *                         type: string
 *                       addedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Invalid video URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *       500:
 *         description: Server error
 */
router.post('/:roomId/queue', queueController.addToQueue);

/**
 * @swagger
 * /api/{roomId}/queue:
 *   delete:
 *     summary: Remove a video from the queue
 *     tags: [Queue]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *         description: The room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: The video was removed from the queue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 roomId:
 *                   type: string
 *                 videos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       videoUrl:
 *                         type: string
 *                       addedAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
router.delete('/:roomId/queue', queueController.removeFromQueue);

module.exports = router;
