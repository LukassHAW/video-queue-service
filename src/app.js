const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const queueRoutes = require('./routes/queueRoutes');
const setupSwagger = require('./swagger');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(error => console.log(error));

app.use('/api', queueRoutes);
setupSwagger(app);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
