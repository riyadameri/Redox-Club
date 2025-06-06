









const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

// Connect to MongoDB
mongoose.mongoose.connect(
  'mongodb://riyadammmeri:OmGe6UeG1Q0hVJEq@ac-ujqhcf3-shard-00-00.7xu8hz3.mongodb.net:27017,ac-ujqhcf3-shard-00-01.7xu8hz3.mongodb.net:27017,ac-ujqhcf3-shard-00-02.7xu8hz3.mongodb.net:27017/?ssl=true&replicaSet=atlas-3anew8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0'
  , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// create a schema for Redox data
const ClubSignalSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    UniversityId: String,
    StudentName: String,
    StudentLevel: String,
    PrimaryDepartment: String,
    SpecificTeamInterest: String,
    SkillsAndExperience : String,
    MotivationForJoining: String,
});
const ClubSignal = mongoose.model('ClubSignal', ClubSignalSchema);

const MessagesShema = new mongoose.Schema({
    Name: String,
    Email: String,
    Subject: String,
    Message: String,
});
const Messages = mongoose.model('Messages', MessagesShema);
app.use(cors());
app.post('/api/club-signals', bodyParser.json(), async (req, res) => {
  try {
    const clubSignal = new ClubSignal(req.body);
    await clubSignal.save();
    res.status(201).json(clubSignal);
  }
    catch (error) {
        console.error('Error saving club signal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/api/club-signals/SendUsMessage', bodyParser.json(), async (req, res) => {
    try {
        const message = new Messages(req.body);
        await message.save();
        res.status(201).json(message);
    }
        catch (error) {
            console.error('Error saving message:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
app.get('/api/getMessages', async (req, res) => {
    try {
        const messages = await Messages.find();
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.use(express.static(path.join(__dirname, 'public')));


// Serve HTML file for all other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.get('/api/club-signals', async (req, res) => {
  try {
    const clubSignals = await ClubSignal.find();
    res.status(200).json(clubSignals);
  }
  catch (error) {
    console.error('Error fetching club signals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})