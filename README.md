# video-queue-service

## Projektübersicht

Der Video Queue Management Service verwaltet die Warteschlange von Videos, die in verschiedenen Räumen abgespielt werden sollen. Er ermöglicht das Hinzufügen, Abrufen und Entfernen von Videos aus der Warteschlange.

## Installation

### Voraussetzungen

- Node.js v12.x oder höher
- MongoDB

### Schritte

1. Klonen Sie das Repository:

   ```bash
   git clone https://github.com/your-repo/video-queue-service.git
   cd video-queue-service
   ```

2. Installieren Sie die Abhängigkeiten:

   ```bash
   npm install
   ```

3. Erstellen Sie eine `.env`-Datei im Projektverzeichnis mit folgendem Inhalt:

   ```
   MONGODB_URI=mongodb://localhost:27017/videoQueue
   PORT=5001
   ```

4. Starten Sie den Server:

   ```bash
   npm start
   ```

## Verwendung

Die API-Dokumentation ist mit Swagger verfügbar. Starten Sie den Server und öffnen Sie `http://localhost:5001/api-docs` in Ihrem Browser, um die Dokumentation zu sehen.

### API-Endpunkte

#### POST /api/{roomId}/queue

- **Beschreibung**: Fügt ein Video zur Warteschlange hinzu.
- **Parameter**:
  - `roomId` (Pfad): Die ID des Raums.
  - `videoUrl` (Körper): Die URL des hinzuzufügenden Videos.
- **Antworten**:
  - `201 Created`: Video erfolgreich hinzugefügt.
  - `400 Bad Request`: Ungültige Video-URL oder Video bereits in der Warteschlange.
  - `500 Internal Server Error`: Serverfehler.

- **Beispiel-Anfrage**:

  ```bash
  curl -X POST "http://localhost:5001/api/room123/queue" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"videoUrl\":\"https://www.youtube.com/watch?v=dQw4w9WgXcQ\"}"
  ```

#### GET /api/{roomId}/queue

- **Beschreibung**: Ruft die aktuelle Warteschlange für einen Raum ab.
- **Parameter**:
  - `roomId` (Pfad): Die ID des Raums.
- **Antworten**:
  - `200 OK`: Warteschlange erfolgreich abgerufen.
  - `404 Not Found`: Raum nicht gefunden.
  - `500 Internal Server Error`: Serverfehler.

- **Beispiel-Anfrage**:

  ```bash
  curl -X GET "http://localhost:5001/api/room123/queue" -H "accept: application/json"
  ```

#### DELETE /api/{roomId}/queue

- **Beschreibung**: Entfernt ein Video aus der Warteschlange.
- **Parameter**:
  - `roomId` (Pfad): Die ID des Raums.
  - `videoId` (Körper): Die ID des zu entfernenden Videos.
- **Antworten**:
  - `200 OK`: Video erfolgreich entfernt.
  - `404 Not Found`: Raum oder Video nicht gefunden.
  - `500 Internal Server Error`: Serverfehler.

- **Beispiel-Anfrage**:

  ```bash
  curl -X DELETE "http://localhost:5001/api/room123/queue" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"videoId\":\"videoId123\"}"
  ```

## Tests

Führen Sie die Tests mit dem folgenden Befehl aus:

```bash
npm test
```

### Beispiel für die Testdatei

**tests/queueController.test.js**:

```javascript
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

const queueRoutes = require('../src/routes/queueRoutes');
app.use('/api', queueRoutes);

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/videoQueueTest', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
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
```

## Abhängigkeiten

- `dotenv`: Zum Laden von Umgebungsvariablen.
- `express`: Web-Framework für Node.js.
- `express-validator`: Middleware für die Validierung von Anfragen.
- `mongoose`: ODM (Object Data Modeling) Bibliothek für MongoDB und Node.js.
- `swagger-jsdoc`: Zur Generierung von Swagger-Dokumentation.
- `swagger-ui-express`: Zum Bereitstellen der Swagger-Dokumentation.

## Umgebungsvariablen

- `MONGODB_URI`: Die URI Ihrer MongoDB-Datenbank.
- `PORT`: Der Port, auf dem der Server laufen soll (Standard: 5001).
```

Dieses README enthält alle notwendigen Informationen zur Installation, Nutzung und Testen Ihres Video Queue Management Services.