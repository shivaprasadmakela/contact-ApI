const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5004;

const mongoURI = 'mongodb+srv://shivaprasadmakela:Shiva123@contact.mcx0acy.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const corsOptions = {
  origin: 'http://localhost:3004',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  message: String,
});

const Contact = mongoose.model('Contact', contactSchema);

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, number, message } = req.body;
    const contact = new Contact({ name, email, number, message });
    await contact.save();
    res.status(201).json({ message: 'Contact saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Closing server gracefully.');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
