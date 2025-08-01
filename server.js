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

  }
)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));



// Middleware للتحقق من كلمة المرور
const checkAdminPassword = (req, res, next) => {
    const correctPassword = "rdaFxir40engmRdxlkenjUItkdn49Cslidn$9&hjhn#&785";
    
    // التحقق من كلمة المرور إما عبر query parameter أو body أو headers
    const providedPassword = req.query.password || req.body.password || req.headers['x-admin-password'];
    
    if (providedPassword === correctPassword) {
        return next(); // كلمة المرور صحيحة، المتابعة
    }
    
    // إذا لم تكن كلمة المرور صحيحة، عرض صفحة تسجيل الدخول
    if (req.method === 'GET') {
        // Determine the target path based on the original URL
        const targetPath = req.originalUrl.startsWith('/adminPanel') ? '/adminPanel' : '/admin';
        
        return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Admin Login</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f5f5f5; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                    .login-box { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 300px; text-align: center; }
                    h1 { color: #1a2a6c; margin-bottom: 20px; }
                    input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
                    button { background-color: #1a2a6c; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; width: 100%; }
                    button:hover { background-color: #0d1a4a; }
                    .error { color: red; margin-top: 10px; }
                </style>
            </head>
            <body>
                <div class="login-box">
                    <h1>Admin Login</h1>
                    <form method="GET" action="${targetPath}">
                        <input type="password" name="password" placeholder="Enter admin password" required>
                        <button type="submit">Login</button>
                    </form>
                    ${req.query.incorrect ? '<p class="error">Incorrect password. Please try again.</p>' : ''}
                </div>
            </body>
            </html>
        `);
    }
    
    // للطلبات غير GET (مثل POST، DELETE)
    res.status(401).json({ success: false, error: "Unauthorized: Invalid admin password" });
};


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

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Registration endpoint
app.post('/api/club-signals', async (req, res) => {
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
app.post('/api/club-signals/SendUsMessage', async (req, res) => {
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

// Delete signal by ID
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

// Delete signal by email
app.delete('/api/club-signals/email/:email', async (req, res) => {
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

// Student schema
const CslStudentsSigners = new mongoose.Schema({
    // New field to hold the unique student ID.
    // We add a 'default' value using a function to ensure it's generated for every new document.
    studentId: {
        type: String,
        required: true,
        unique: true,
        default: () => crypto.randomUUID() // Generates a unique ID automatically
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensure email is also unique to prevent duplicates
    birthDate: { type: Date, required: true },
    phone: { type: String, required: true },
    courses: { 
        type: [String], 
        required: true,
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'Please select at least one course'
        }
    },
    location: { 
        type: String, 
        required: true,
        enum: ['Tamasin', 'Touggourt']
    },
    createdAt: { type: Date, default: Date.now }
});

// Define the model
const Student = mongoose.model('CslStudents', CslStudentsSigners);

// --- API Endpoint to Create a New Student ---

app.post('/api/students', async (req, res) => {
    console.log(req.body);
    try {
        const { firstName, lastName, email, birthDate, phone, courses, location } = req.body;

        // Basic input validation
        if (!firstName || !lastName || !email || !birthDate || !phone || !courses || !location) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required.'
            });
        }
        
        // Validate that at least one course is selected
        if (!Array.isArray(courses) || courses.length === 0) {
            return res.status(400).json({ 
                success: false,
                error: 'Please select at least one course' 
            });
        }

        // Create a new student instance. The `studentId` will be generated automatically by the schema's `default` function.
        const student = new Student({
            firstName,
            lastName,
            email,
            birthDate: new Date(birthDate),
            phone,
            courses: courses,
            location
        });

        // Save to database
        await student.save();
        res.status(201).json({
            success: true,
            data: student
        });

    } catch (err) {
        console.error('Error saving student:', err);
        
        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                error: errors.join(', ')
            });
        }
        
        // Handle the duplicate key error specifically for studentId and email
        if (err.code === 11000) {
            if (err.keyPattern && err.keyPattern.studentId) {
                 return res.status(400).json({
                    success: false,
                    error: 'A unique student ID is required. Please try again.'
                });
            }
            if (err.keyPattern && err.keyPattern.email) {
                 return res.status(400).json({
                    success: false,
                    error: 'Email already registered.'
                });
            }
        }
        
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});


app.put('/api/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const updates = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(studentId, updates, { new: true, runValidators: true });

        if (!updatedStudent) {
            return res.status(404).json({ success: false, error: 'Student not found.' });
        }

        res.json({ success: true, data: updatedStudent });

    } catch (err) {
        console.error('Error updating student:', err);
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ success: false, error: errors.join(', ') });
        }
        if (err.code === 11000) {
             return res.status(400).json({ success: false, error: 'Email already registered.' });
        }
        res.status(500).json({ success: false, error: 'Server error' });
    }
});



app.delete('/api/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const deletedStudent = await Student.findByIdAndDelete(studentId);

        if (!deletedStudent) {
            return res.status(404).json({ success: false, error: 'Student not found.' });
        }

        res.json({ success: true, message: 'Student deleted successfully.' });

    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});



// Serve HTML Form
app.get('/csl', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'csl-form.html'));
});

// Admin dashboard
app.get('/admin', checkAdminPassword, async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        const clubSignals = await ClubSignal.find().sort({ createdAt: -1 });
        const messages = await Messages.find().sort({ createdAt: -1 });
        
        let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Redox Admin Dashboard</title>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                :root {
                    --primary: #1a2a6c;
                    --secondary: #fdbb2d;
                    --accent: #b21f1f;
                    --light: #f8f9fa;
                    --dark: #212529;
                    --shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    --border-radius: 15px;
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Poppins', sans-serif;
                    background-color: #f0f2f5;
                    color: var(--dark);
                    line-height: 1.6;
                    padding: 20px;
                    transition: background-color 0.3s ease;
                }
                
                body.ar {
                    direction: rtl;
                    text-align: right;
                    font-family: 'Tajawal', sans-serif;
                }

                .container {
                    max-width: 1400px;
                    margin: 0 auto;
                }
                
                header {
                    background: linear-gradient(135deg, var(--primary), #4b6cb7);
                    color: white;
                    padding: 30px 20px;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                    margin-bottom: 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    animation: slideDown 0.8s ease-out;
                }
                
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .logo img {
                    height: 60px;
                    filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
                    animation: pulse 2s infinite;
                }

                .header-title {
                    text-align: center;
                }
                
                h1 {
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 5px;
                }
                
                .lang-toggle {
                    background: none;
                    border: 2px solid white;
                    color: white;
                    padding: 8px 15px;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .lang-toggle:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                    transform: scale(1.05);
                }

                .stats-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                    animation: fadeIn 1s ease-in;
                }
                
                .stat-card {
                    background: white;
                    border-radius: var(--border-radius);
                    padding: 25px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                    border-left: 5px solid var(--primary);
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    overflow: hidden;
                    position: relative;
                }
                
                body.ar .stat-card {
                    border-left: none;
                    border-right: 5px solid var(--primary);
                }
                
                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }
                
                .stat-card:nth-child(2) { border-color: var(--secondary); }
                .stat-card:nth-child(3) { border-color: var(--accent); }
                
                .stat-title {
                    font-size: 16px;
                    font-weight: 500;
                    color: #666;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .stat-value {
                    font-size: 40px;
                    font-weight: 700;
                    color: var(--primary);
                }
                
                .section {
                    background: white;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                    margin-bottom: 30px;
                    overflow: hidden;
                    animation: fadeInUp 0.8s ease-out;
                }
                
                .section-header {
                    background: linear-gradient(to right, var(--primary), #3a7bd5);
                    color: white;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .section-header:hover {
                    background: linear-gradient(to right, #3a7bd5, var(--primary));
                }

                .section-header h2 {
                    font-size: 22px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .section-content {
                    max-height: 500px;
                    overflow-y: auto;
                    transition: max-height 0.4s ease-in-out;
                }
                
                .section-content.collapsed {
                    max-height: 0;
                    padding-top: 0;
                    padding-bottom: 0;
                }

                .section-content table {
                    width: 100%;
                }
                
                th, td {
                    padding: 15px;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }
                
                body.ar th, body.ar td {
                    text-align: right;
                }

                th {
                    background-color: #f8f9fa;
                    color: var(--primary);
                    font-weight: 600;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                
                tbody tr:hover {
                    background-color: #f5f7fa;
                }

                /* Action buttons in tables */
                .actions {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                }

                .action-btn {
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 14px;
                }

                .action-btn.edit {
                    background: var(--primary);
                }

                .action-btn.delete {
                    background: var(--accent);
                }

                .action-btn:hover {
                    opacity: 0.8;
                    transform: translateY(-2px);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                }

                /* Modal styling */
                .modal {
                    display: none;
                    position: fixed;
                    z-index: 100;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.4);
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                }
                
                .modal-content {
                    background-color: #fff;
                    padding: 30px;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                    width: 90%;
                    max-width: 500px;
                    animation: zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }

                .modal-header h3 {
                    font-size: 24px;
                    color: var(--primary);
                }

                .close-btn {
                    color: #aaa;
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: color 0.3s ease;
                }

                .close-btn:hover, .close-btn:focus {
                    color: var(--accent);
                }
                
                .form-group {
                    margin-bottom: 15px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                    color: var(--dark);
                }
                
                .form-group input, .form-group select {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-family: inherit;
                    font-size: 16px;
                    transition: border-color 0.3s ease;
                }

                .form-group input:focus, .form-group select:focus {
                    outline: none;
                    border-color: var(--primary);
                }
                
                .modal-footer {
                    padding-top: 20px;
                    text-align: right;
                }

                .modal-footer button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .modal-footer .save-btn {
                    background: var(--primary);
                    color: white;
                }

                .modal-footer .cancel-btn {
                    background: #ccc;
                    color: var(--dark);
                }
                
                .modal-footer .save-btn:hover {
                    opacity: 0.9;
                }

                .modal-footer .cancel-btn:hover {
                    background: #bbb;
                }

                /* Delete confirmation modal */
                #delete-modal .modal-content {
                    text-align: center;
                }

                #delete-modal .modal-footer {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                }

                /* Responsive Tables */
                @media screen and (max-width: 768px) {
                    table, thead, tbody, th, td, tr {
                        display: block;
                    }

                    thead tr {
                        position: absolute;
                        top: -9999px;
                        left: -9999px;
                    }
                    
                    tr {
                        border: 1px solid #ccc;
                        margin-bottom: 15px;
                        border-radius: 8px;
                        overflow: hidden;
                    }

                    td {
                        border: none;
                        border-bottom: 1px solid #eee;
                        position: relative;
                        padding-left: 50%;
                        text-align: right;
                    }

                    body.ar td {
                        padding-left: 0;
                        padding-right: 50%;
                        text-align: left;
                    }

                    td:before {
                        position: absolute;
                        top: 0;
                        left: 6px;
                        width: 45%;
                        padding-right: 10px;
                        white-space: nowrap;
                        text-align: left;
                        font-weight: 600;
                        color: var(--primary);
                        padding-top: 15px;
                    }

                    body.ar td:before {
                        left: auto;
                        right: 6px;
                        text-align: right;
                    }

                    td[data-label]:before { content: attr(data-label); }
                }

                @media screen and (max-width: 480px) {
                    body {
                        padding: 10px;
                    }
                    h1 {
                        font-size: 24px;
                    }
                    .logo img {
                        height: 45px;
                    }
                    .lang-toggle {
                        padding: 6px 12px;
                        font-size: 14px;
                    }
                    .stat-value {
                        font-size: 32px;
                    }
                    .section-header h2 {
                        font-size: 18px;
                    }
                }
                
                @keyframes slideDown {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes zoomIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                
                @keyframes fadeInUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            </style>
        </head>
        <body lang="en">
            <div class="container">
                <header>
                    <div class="logo">
                        <img src="https://placehold.co/60x60/1a2a6c/ffffff?text=Rx" alt="Redox Logo">
                        <div class="header-title">
                            <h1>Redox Admin Dashboard</h1>
                            <p>Comprehensive management panel</p>
                        </div>
                    </div>
                    <button id="lang-toggle" class="lang-toggle" data-lang="en">
                        <i class="fas fa-language"></i>
                        <span>عربي</span>
                    </button>
                </header>
                
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-title"><i class="fas fa-users"></i> Total Students</div>
                        <div class="stat-value">${students.length}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title"><i class="fas fa-flag"></i> Club Signals</div>
                        <div class="stat-value">${clubSignals.length}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title"><i class="fas fa-envelope"></i> Messages</div>
                        <div class="stat-value">${messages.length}</div>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-header">
                        <h2><i class="fas fa-users"></i> CSL Students</h2>
                        <span class="count">${students.length} records</span>
                    </div>
                    <div class="section-content">
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Courses</th>
                                        <th>Location</th>
                                        <th>Registration Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
        `;
        
        students.forEach(student => {
            html += `
                                    <tr data-id="${student._id}">
                                        <td data-label="Name">${student.firstName} ${student.lastName}</td>
                                        <td data-label="Email">${student.email}</td>
                                        <td data-label="Phone">${student.phone}</td>
                                        <td data-label="Courses">${student.courses.join(', ')}</td>
                                        <td data-label="Location">${student.location}</td>
                                        <td data-label="Registration Date">${new Date(student.createdAt).toLocaleString()}</td>
                                        <td data-label="Actions">
                                            <div class="actions">
                                                <button class="action-btn edit" data-id="${student._id}"><i class="fas fa-edit"></i> Edit</button>
                                                <button class="action-btn delete" data-id="${student._id}"><i class="fas fa-trash-alt"></i> Delete</button>
                                            </div>
                                        </td>
                                    </tr>
            `;
        });
        
        html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-header">
                        <h2><i class="fas fa-flag"></i> Club Signals</h2>
                        <span class="count">${clubSignals.length} records</span>
                    </div>
                    <div class="section-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>University ID</th>
                                    <th>Department</th>
                                    <th>Registration Number</th>
                                    <th>Registration Date</th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        clubSignals.forEach(signal => {
            html += `
                                <tr>
                                    <td data-label="Name">${signal.firstName} ${signal.lastName}</td>
                                    <td data-label="Email">${signal.email}</td>
                                    <td data-label="Phone">${signal.phone || 'N/A'}</td>
                                    <td data-label="University ID">${signal.UniversityId || 'N/A'}</td>
                                    <td data-label="Department">${signal.PrimaryDepartment || 'N/A'}</td>
                                    <td data-label="Registration Number">${signal.registrationNumber}</td>
                                    <td data-label="Registration Date">${new Date(signal.createdAt).toLocaleString()}</td>
                                </tr>
            `;
        });
        
        html += `
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-header">
                        <h2><i class="fas fa-envelope"></i> Messages</h2>
                        <span class="count">${messages.length} records</span>
                    </div>
                    <div class="section-content">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Subject</th>
                                    <th>Message</th>
                                    <th>Reference Number</th>
                                    <th>Received Date</th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        messages.forEach(message => {
            html += `
                                <tr>
                                    <td data-label="Name">${message.Name}</td>
                                    <td data-label="Email">${message.Email}</td>
                                    <td data-label="Subject">${message.Subject}</td>
                                    <td data-label="Message">${message.Message.substring(0, 50)}${message.Message.length > 50 ? '...' : ''}</td>
                                    <td data-label="Reference Number">${message.messageNumber}</td>
                                    <td data-label="Received Date">${new Date(message.createdAt).toLocaleString()}</td>
                                </tr>
            `;
        });
        
        html += `
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Modals -->
                
                <!-- Edit Student Modal -->
                <div id="edit-modal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 id="modal-title">Edit Student</h3>
                            <span class="close-btn">&times;</span>
                        </div>
                        <form id="edit-student-form">
                            <input type="hidden" id="edit-student-id">
                            <div class="form-group">
                                <label for="edit-firstName">First Name</label>
                                <input type="text" id="edit-firstName" name="firstName" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-lastName">Last Name</label>
                                <input type="text" id="edit-lastName" name="lastName" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-email">Email</label>
                                <input type="email" id="edit-email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-phone">Phone</label>
                                <input type="tel" id="edit-phone" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-courses">Courses (comma separated)</label>
                                <input type="text" id="edit-courses" name="courses" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-location">Location</label>
                                <select id="edit-location" name="location" required>
                                    <option value="Tamasin">Tamasin</option>
                                    <option value="Touggourt">Touggourt</option>
                                </select>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="cancel-btn">Cancel</button>
                                <button type="submit" class="save-btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Delete Confirmation Modal -->
                <div id="delete-modal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 id="delete-modal-title">Confirm Deletion</h3>
                            <span class="close-btn">&times;</span>
                        </div>
                        <p>Are you sure you want to delete this student's record? This action cannot be undone.</p>
                        <div class="modal-footer">
                            <button type="button" id="confirm-delete-btn" class="action-btn delete">Delete</button>
                            <button type="button" class="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
                
                <script>
                    const translations = {
                        en: {
                            langButton: 'عربي',
                            title: 'Redox Admin Dashboard',
                            subtitle: 'Comprehensive management panel',
                            totalStudents: 'Total Students',
                            clubSignals: 'Club Signals',
                            messages: 'Messages',
                            cslStudents: 'CSL Students',
                            records: 'records',
                            name: 'Name',
                            email: 'Email',
                            phone: 'Phone',
                            courses: 'Courses',
                            location: 'Location',
                            regDate: 'Registration Date',
                            actions: 'Actions',
                            edit: 'Edit',
                            delete: 'Delete',
                            universityID: 'University ID',
                            department: 'Department',
                            regNumber: 'Registration Number',
                            subject: 'Subject',
                            message: 'Message',
                            refNumber: 'Reference Number',
                            receivedDate: 'Received Date',
                            editModalTitle: 'Edit Student',
                            firstName: 'First Name',
                            lastName: 'Last Name',
                            coursesLabel: 'Courses (comma separated)',
                            locationLabel: 'Location',
                            saveChanges: 'Save Changes',
                            cancel: 'Cancel',
                            confirmDeletionTitle: 'Confirm Deletion',
                            confirmDeletionText: 'Are you sure you want to delete this student\'s record? This action cannot be undone.',
                            deleteConfirm: 'Delete',
                            deleteCancel: 'Cancel',
                        },
                        ar: {
                            langButton: 'English',
                            title: 'لوحة تحكم Redox',
                            subtitle: 'لوحة إدارة شاملة',
                            totalStudents: 'إجمالي الطلاب',
                            clubSignals: 'طلبات الانضمام للنادي',
                            messages: 'الرسائل',
                            cslStudents: 'طلاب CSL',
                            records: 'سجل',
                            name: 'الاسم',
                            email: 'البريد الإلكتروني',
                            phone: 'الهاتف',
                            courses: 'الدورات',
                            location: 'الموقع',
                            regDate: 'تاريخ التسجيل',
                            actions: 'الإجراءات',
                            edit: 'تعديل',
                            delete: 'حذف',
                            universityID: 'الرقم الجامعي',
                            department: 'القسم',
                            regNumber: 'رقم التسجيل',
                            subject: 'الموضوع',
                            message: 'الرسالة',
                            refNumber: 'الرقم المرجعي',
                            receivedDate: 'تاريخ الاستلام',
                            editModalTitle: 'تعديل معلومات الطالب',
                            firstName: 'الاسم الأول',
                            lastName: 'الاسم الأخير',
                            coursesLabel: 'الدورات (مفصولة بفواصل)',
                            locationLabel: 'الموقع',
                            saveChanges: 'حفظ التغييرات',
                            cancel: 'إلغاء',
                            confirmDeletionTitle: 'تأكيد الحذف',
                            confirmDeletionText: 'هل أنت متأكد من حذف سجل هذا الطالب؟ لا يمكن التراجع عن هذا الإجراء.',
                            deleteConfirm: 'حذف',
                            deleteCancel: 'إلغاء',
                        }
                    };

                    function updateContent(lang) {
                        const t = translations[lang];
                        document.body.lang = lang;
                        document.body.classList.toggle('ar', lang === 'ar');
                        
                        document.querySelector('title').textContent = t.title;
                        document.querySelector('h1').textContent = t.title;
                        document.querySelector('header p').textContent = t.subtitle;
                        document.getElementById('lang-toggle').innerHTML = '<i class="fas fa-language"></i><span>' + t.langButton + '</span>';
                        document.getElementById('lang-toggle').dataset.lang = lang;
                        
                        document.querySelectorAll('.stat-card .stat-title').forEach((el, i) => {
                            const keys = ['totalStudents', 'clubSignals', 'messages'];
                            el.innerHTML = '<i class="'+ el.querySelector('i').className +'"></i>' + t[keys[i]];
                        });

                        document.querySelectorAll('.section-header h2').forEach((el, i) => {
                            const keys = ['cslStudents', 'clubSignals', 'messages'];
                            const count = el.textContent.match(/\d+/);
                            el.innerHTML = '<i class="'+ el.querySelector('i').className +'"></i>' + t[keys[i]];
                            if(count) {
                                el.parentNode.querySelector('.count').innerHTML = count[0] + ' ' + t.records;
                            }
                        });
                        
                        // Update table headers
                        const tables = document.querySelectorAll('table');
                        const headers = [
                            ['name', 'email', 'phone', 'courses', 'location', 'regDate', 'actions'],
                            ['name', 'email', 'phone', 'universityID', 'department', 'regNumber', 'regDate'],
                            ['name', 'email', 'subject', 'message', 'refNumber', 'receivedDate']
                        ];
                        
                        tables.forEach((table, tableIndex) => {
                            const ths = table.querySelectorAll('th');
                            ths.forEach((th, i) => {
                                th.textContent = t[headers[tableIndex][i]];
                            });

                            const tds = table.querySelectorAll('td');
                            tds.forEach((td, i) => {
                                // Exclude the actions column from the data-label on mobile
                                const headerIndex = i % headers[tableIndex].length;
                                if (headers[tableIndex][headerIndex] !== 'actions') {
                                    td.dataset.label = t[headers[tableIndex][headerIndex]];
                                } else {
                                    td.dataset.label = t.actions;
                                }
                            });
                        });
                        
                        // Update buttons and modal content
                        document.querySelectorAll('.action-btn.edit').forEach(btn => btn.innerHTML = '<i class="fas fa-edit"></i> ' + t.edit);
                        document.querySelectorAll('.action-btn.delete').forEach(btn => btn.innerHTML = '<i class="fas fa-trash-alt"></i> ' + t.delete);

                        document.getElementById('modal-title').textContent = t.editModalTitle;
                        document.querySelector('label[for="edit-firstName"]').textContent = t.firstName;
                        document.querySelector('label[for="edit-lastName"]').textContent = t.lastName;
                        document.querySelector('label[for="edit-email"]').textContent = t.email;
                        document.querySelector('label[for="edit-phone"]').textContent = t.phone;
                        document.querySelector('label[for="edit-courses"]').textContent = t.coursesLabel;
                        document.querySelector('label[for="edit-location"]').textContent = t.locationLabel;
                        document.querySelector('#edit-student-form .save-btn').textContent = t.saveChanges;
                        document.querySelector('#edit-student-form .cancel-btn').textContent = t.cancel;
                        
                        document.getElementById('delete-modal-title').textContent = t.confirmDeletionTitle;
                        document.querySelector('#delete-modal p').textContent = t.confirmDeletionText;
                        document.getElementById('confirm-delete-btn').textContent = t.deleteConfirm;
                        document.querySelector('#delete-modal .cancel-btn').textContent = t.deleteCancel;

                    }

                    document.addEventListener('DOMContentLoaded', function() {
                        const langToggle = document.getElementById('lang-toggle');
                        const editModal = document.getElementById('edit-modal');
                        const deleteModal = document.getElementById('delete-modal');
                        const studentTable = document.querySelector('.section-content table tbody');
                        let studentToDeleteId = null;

                        // Language Toggle
                        langToggle.addEventListener('click', function() {
                            const currentLang = this.dataset.lang;
                            const newLang = currentLang === 'en' ? 'ar' : 'en';
                            updateContent(newLang);
                        });
                        
                        // Section collapse/expand
                        const sectionHeaders = document.querySelectorAll('.section-header');
                        sectionHeaders.forEach(header => {
                            header.addEventListener('click', function() {
                                const content = this.nextElementSibling;
                                const isCollapsed = content.classList.toggle('collapsed');
                                if (!isCollapsed) {
                                    content.style.maxHeight = content.scrollHeight + 'px';
                                } else {
                                    content.style.maxHeight = '0';
                                }
                            });
                        });
                        
                        // Initial state: all sections are open.
                        document.querySelectorAll('.section-content').forEach(content => {
                             content.style.maxHeight = content.scrollHeight + 'px';
                        });

                        // Set initial language to English
                        updateContent('en');

                        // Event delegation for Edit and Delete buttons
                        studentTable.addEventListener('click', async (e) => {
                            // Find the button or its parent with the data-id
                            const button = e.target.closest('.action-btn');
                            if (!button) return;

                            const studentId = button.dataset.id;
                            const row = button.closest('tr');
                            if (!studentId || !row) return;


                            if (button.classList.contains('edit')) {
                                // Handle Edit button click
                                const firstName = row.children[0].textContent.split(' ')[0];
                                const lastName = row.children[0].textContent.split(' ')[1];
                                const email = row.children[1].textContent;
                                const phone = row.children[2].textContent;
                                const courses = row.children[3].textContent;
                                const location = row.children[4].textContent;

                                document.getElementById('edit-student-id').value = studentId;
                                document.getElementById('edit-firstName').value = firstName;
                                document.getElementById('edit-lastName').value = lastName;
                                document.getElementById('edit-email').value = email;
                                document.getElementById('edit-phone').value = phone;
                                document.getElementById('edit-courses').value = courses;
                                document.getElementById('edit-location').value = location;

                                editModal.style.display = 'flex';
                            } else if (button.classList.contains('delete')) {
                                // Handle Delete button click
                                studentToDeleteId = studentId;
                                deleteModal.style.display = 'flex';
                            }
                        });

                        // Modal close buttons
                        document.querySelectorAll('.close-btn, .cancel-btn').forEach(btn => {
                            btn.addEventListener('click', () => {
                                editModal.style.display = 'none';
                                deleteModal.style.display = 'none';
                            });
                        });

                        // Handle form submission for editing a student
                        document.getElementById('edit-student-form').addEventListener('submit', async (e) => {
                            e.preventDefault();
                            const studentId = document.getElementById('edit-student-id').value;
                            const updatedData = {
                                firstName: document.getElementById('edit-firstName').value,
                                lastName: document.getElementById('edit-lastName').value,
                                email: document.getElementById('edit-email').value,
                                phone: document.getElementById('edit-phone').value,
                                courses: document.getElementById('edit-courses').value.split(',').map(c => c.trim()),
                                location: document.getElementById('edit-location').value
                            };

                            try {
                                const response = await fetch(\`/api/students/\${studentId}\`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(updatedData)
                                });
                                
                                const result = await response.json();
                                if (result.success) {
                                    // Refresh the page or update the specific table row
                                    window.location.reload(); 
                                } else {
                                    console.error('Update failed:', result.error);
                                    // You can display an error message to the user here
                                }
                            } catch (error) {
                                console.error('Error updating student:', error);
                            } finally {
                                editModal.style.display = 'none';
                            }
                        });

                        // Handle delete confirmation
                        document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
                            if (!studentToDeleteId) return;

                            try {
                                const response = await fetch(\`/api/students/\${studentToDeleteId}\`, {
                                    method: 'DELETE'
                                });
                                
                                const result = await response.json();
                                if (result.success) {
                                    // Remove the student row from the table
                                    const rowToRemove = document.querySelector(\`tr[data-id="\${studentToDeleteId}"]\`);
                                    if (rowToRemove) {
                                        rowToRemove.remove();
                                        // Update the count on the dashboard
                                        const countSpan = document.querySelector('.section-header h2 i.fa-users').nextElementSibling;
                                        if (countSpan) {
                                            const currentCount = parseInt(countSpan.textContent) || 0;
                                            countSpan.textContent = \`\${currentCount - 1} records\`;
                                        }
                                        const statValue = document.querySelector('.stat-card:first-child .stat-value');
                                        if (statValue) {
                                            const currentStat = parseInt(statValue.textContent) || 0;
                                            statValue.textContent = currentStat - 1;
                                        }
                                    }
                                } else {
                                    console.error('Deletion failed:', result.error);
                                    // Display error message
                                }
                            } catch (error) {
                                console.error('Error deleting student:', error);
                            } finally {
                                deleteModal.style.display = 'none';
                                studentToDeleteId = null;
                            }
                        });
                    });
                </script>
            </div>
        </body>
        </html>
        `;
        
        res.send(html);
    } catch (err) {
        console.error('Error loading dashboard:', err);
        res.status(500).send('Error loading dashboard');
    }
});
// Serve HTML file for all other routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/adminPanel', checkAdminPassword ,(req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'faq.html'));
});

app.get('/form-csl', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'حدث خطأ غير متوقع في الخادم'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});