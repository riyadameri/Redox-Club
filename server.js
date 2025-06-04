require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI 

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Member Schema
const memberSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  universityId: String,
  studyLevel: String,
  department: { type: String, required: true },
  team: String,
  skills: String,
  motivation: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now }
});

const Member = mongoose.model('Member', memberSchema);

// API Routes
app.post('/api/v1/members', async (req, res) => {
  try {
    const newMember = new Member(req.body);
    await newMember.save();
    res.status(201).json({ 
      success: true,
      message: 'Registration successful!',
      member: newMember
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ 
        success: false,
        message: 'This email is already registered.'
      });
    } else {
      console.error('Registration error:', error);
      res.status(500).json({ 
        success: false,
        message: 'An error occurred during registration.'
      });
    }
  }
});

app.get('/api/v1/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ registrationDate: -1 });
    res.json({ 
      success: true,
      count: members.length,
      members
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching members'
    });
  }
});

// Serve HTML file for all other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});