const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Make sure to install dotenv using npm install dotenv

const app = express();
const PORT = process.env.PORT || 3000;

// Improved error handling and logging
const logger = require('morgan');
app.use(logger('dev'));

app.use(express.json()); // For parsing application/json

// MongoDB connection URI from environment variables for better security
const mongoURI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_SERVICE_HOST}:${process.env.MONGODB_SERVICE_PORT}/${process.env.MONGODB_DATABASE}`;



// Enhanced Mongoose connection setup for production
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, // Helps ensure that Mongoose uses MongoDB’s newer index creation
  useFindAndModify: false, // For handling deprecation warnings
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Define a schema and model for your MongoDB collection
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true }); // Adding timestamps for creation and updates
const Todo = mongoose.model('Todo', todoSchema);

// Define API endpoints
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Additional middleware for error handling and 404 responses
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
