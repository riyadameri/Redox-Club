const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Connect to MongoDB
mongoose.connect(
  'mongodb://riyadammmeri:OmGe6UeG1Q0hVJEq@ac-ujqhcf3-shard-00-00.7xu8hz3.mongodb.net:27017,ac-ujqhcf3-shard-00-01.7xu8hz3.mongodb.net:27017,ac-ujqhcf3-shard-00-02.7xu8hz3.mongodb.net:27017/?ssl=true&replicaSet=atlas-3anew8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Create a schema for Redox data
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
    SkillsAndExperience: String,
    MotivationForJoining: String,
    registrationNumber: String // Added for tracking registration number
});
const ClubSignal = mongoose.model('ClubSignal', ClubSignalSchema);

const MessagesSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Subject: String,
    Message: String,
    messageNumber: String // Added for tracking message number
});
const Messages = mongoose.model('Messages', MessagesSchema);

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: 'riyadammmeri@gmail.com', // replace with your email
        pass: 'tnix ryfx obyq sris' // replace with your email password
    }
});

// Generate a random registration/message number
function generateNumber(prefix = 'REDOX') {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${prefix}-${year}${month}-${randomNum}`;
}

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Registration endpoint
app.post('/api/club-signals', bodyParser.json(), async (req, res) => {
    try {
        // Generate registration number
        const registrationNumber = generateNumber('REG');
        
        // Create new club signal with registration number
        const clubSignal = new ClubSignal({
            ...req.body,
            registrationNumber,
            StudentName: `${req.body.firstName} ${req.body.lastName}`
        });
        
        await clubSignal.save();
        
        // Send confirmation email
        const mailOptions = {
            from: 'Redox Club <your-email@gmail.com>',
            to: req.body.email,
            subject: 'Redox Club Registration Confirmation',
            html: `
                <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #1a2a6c; padding: 20px; text-align: center;">
                        <img src="https://redoxcsl.web.app/assets/redox-icon.png" alt="Redox Logo" style="height: 80px;">
                        <h1 style="color: white; margin-top: 15px; margin-bottom: 0;">Redox Club</h1>
                        <p style="color: #fdbb2d; margin-top: 5px;">AI & Technology Club</p>
                    </div>
                    
                    <div style="padding: 25px;">
                        <h2 style="color: #1a2a6c;">Registration Confirmation</h2>
                        <p>Dear ${req.body.firstName},</p>
                        <p>Thank you for registering with Redox Club! We're excited to have you join our community.</p>
                        
                        <div style="background-color: #f8f9fa; border-left: 4px solid #fdbb2d; padding: 15px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #1a2a6c;">Your Registration Details</h3>
                            <p><strong>Registration Number:</strong> ${registrationNumber}</p>
                            <p><strong>Name:</strong> ${req.body.firstName} ${req.body.lastName}</p>
                            <p><strong>Email:</strong> ${req.body.email}</p>
                            <p><strong>Phone:</strong> ${req.body.phone || 'Not provided'}</p>
                            <p><strong>University ID:</strong> ${req.body.UniversityId || 'Not provided'}</p>
                            <p><strong>Department Interest:</strong> ${req.body.PrimaryDepartment}</p>
                            <p><strong>Team Interest:</strong> ${req.body.SpecificTeamInterest || 'Not specified'}</p>
                        </div>
                        
                        <p>Our team will review your application and contact you soon to schedule an interview. This interview will help us understand your interests and skills better.</p>
                        
                        <p>In the meantime, you can explore more about Redox Club on our website or follow us on social media.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://redox-club.onrender.com" style="display: inline-block; background-color: #1a2a6c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit Our Website</a>
                        </div>
                        
                        <p>If you have any questions, feel free to reply to this email.</p>
                        
                        <p>Best regards,<br>
                        <strong>The Redox Club Team</strong></p>
                    </div>
                    
                    <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                        <p>This is an automated message. Please do not reply directly to this email.</p>
                        <p>&copy; ${new Date().getFullYear()} Redox Club. All rights reserved.</p>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        res.status(201).json(clubSignal);
    } catch (error) {
        console.error('Error saving club signal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Contact message endpoint
app.post('/api/club-signals/SendUsMessage', bodyParser.json(), async (req, res) => {
    try {
        // Generate message number
        const messageNumber = generateNumber('MSG');
        
        const message = new Messages({
            ...req.body,
            messageNumber
        });
        
        await message.save();
        
        // Send confirmation email
        const mailOptions = {
            from: 'Redox Club <your-email@gmail.com>',
            to: req.body.Email,
            subject: `We've received your message - ${req.body.Subject}`,
            html: `
                <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #1a2a6c; padding: 20px; text-align: center;">
                        <img src="https://redoxcsl.web.app/assets/redox-icon.png" alt="Redox Logo" style="height: 80px;">
                        <h1 style="color: white; margin-top: 15px; margin-bottom: 0;">Redox Club</h1>
                        <p style="color: #fdbb2d; margin-top: 5px;">AI & Technology Club</p>
                    </div>
                    
                    <div style="padding: 25px;">
                        <h2 style="color: #1a2a6c;">Message Received</h2>
                        <p>Dear ${req.body.Name},</p>
                        <p>Thank you for contacting Redox Club. We've received your message and will get back to you as soon as possible.</p>
                        
                        <div style="background-color: #f8f9fa; border-left: 4px solid #fdbb2d; padding: 15px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #1a2a6c;">Your Message Details</h3>
                            <p><strong>Reference Number:</strong> ${messageNumber}</p>
                            <p><strong>Subject:</strong> ${req.body.Subject}</p>
                            <p><strong>Message:</strong><br>${req.body.Message}</p>
                        </div>
                        
                        <p>Our team typically responds within 2-3 business days. If your inquiry is urgent, you can reach us directly at +213 673 703 773.</p>
                        
                        <p>In the meantime, you might find answers to common questions on our website's FAQ section.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://redox-club.com/faq" style="display: inline-block; background-color: #1a2a6c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit FAQ Section</a>
                        </div>
                        
                        <p>Thank you for your interest in Redox Club!</p>
                        
                        <p>Best regards,<br>
                        <strong>The Redox Club Team</strong></p>
                    </div>
                    
                    <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                        <p>This is an automated message. Please do not reply directly to this email.</p>
                        <p>&copy; ${new Date().getFullYear()} Redox Club. All rights reserved.</p>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        res.status(201).json(message);
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all messages endpoint
app.get('/api/getMessages', async (req, res) => {
    try {
        const messages = await Messages.find();
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all registrations endpoint
app.get('/api/club-signals', async (req, res) => {
    try {
        const clubSignals = await ClubSignal.find();
        res.status(200).json(clubSignals);
    } catch (error) {
        console.error('Error fetching club signals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// delet sign
app.delete('/api/club-signals/:id', async (req, res) => {
    try {
        const deletedSignal = await ClubSignal.findByIdAndDelete(req.params.id);
        if (!deletedSignal) {
            return res.status(404).json({ message: 'Signal not found' });
        }
        res.status(200).json({ message: 'Signal deleted successfully' });
    } catch (error) {
        console.error('Error deleting signal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// remove list of sign by userName
app.delete('/api/club-signals', async (req, res) => {
    try {
        const deletedSignals = await ClubSignal.deleteMany({ userName: req.body.userName });
        res.status(200).json({ message: 'Signals deleted successfully' });
    } catch (error) {
        console.error('Error deleting signals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// delet by email
app.delete('/api/club-signals/:email', async (req, res) => {
    try {
        const deletedSignal = await ClubSignal.findOneAndDelete({ email: req.params.email });
        if (!deletedSignal) {
            return res.status(404).json({ message: 'Signal not found' });
        }
        res.status(200).json({ message: 'Signal deleted successfully' });
    } catch (error) {
        console.error('Error deleting signal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Serve HTML file for all other routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/adminPanel', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'faq.html'));
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});