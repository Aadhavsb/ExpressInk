const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Configuration, OpenAI } = require("openai");
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');

// Import models
const User = require('./models/User');
const Analysis = require('./models/Analysis');

// Import routes
const authRoutes = require('./routes/auth');
const analysisRoutes = require('./routes/analysis');

// Import middleware
const { auth, optionalAuth } = require('./middleware/auth');

require('dotenv').config();

// Set app running on port 8000
const app = express();
const port = 8000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());
app.use(cors());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);

const openai = new OpenAI({
  baseURL: "https://api.omnistack.sh/openai/v1", 
  apiKey: process.env.OPENAI_API_KEY,  
});

// Use multer.diskStorage to save the file in order to display it to the frontend
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    //New filename is the date + original file extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route: Handle image upload
app.post('/upload', optionalAuth, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const filename = req.file.filename;
  const filePath = `/uploads/${filename}`;
  const startTime = Date.now();
  
  try {
    console.log(`Received image upload from backend. File name: ${filename}`);

    // Convert the image to base64 so Omnistack can use it
    const base64Image = fs.readFileSync(req.file.path).toString('base64');

    // Get the OpenAI response (actually omnistack)
    const aiResponse = await getOpenAICompletion(base64Image);
    const processingTime = Date.now() - startTime;

    if (aiResponse) {
      // Save to database if user is authenticated
      if (req.user) {
        try {
          const analysisData = {
            userId: req.user._id,
            imageUrl: filePath,
            originalFilename: req.file.originalname,
            filename: filename,
            analysisType: 'upload',
            sentimentAnalysis: {
              overallSentiment: mapSentimentRating(aiResponse.sentiment_rating),
              confidence: 0.8, // Default confidence since omnistack doesn't provide this
              detailedAnalysis: aiResponse.reasoning_text,
              keyElements: aiResponse.detected_objects || []
            },
            aiResponse: JSON.stringify(aiResponse),
            processingTime: processingTime
          };

          const analysis = new Analysis(analysisData);
          await analysis.save();
          console.log('Analysis saved to database for user:', req.user.username);
        } catch (dbError) {
          console.error('Error saving to database:', dbError);
          return res.status(500).json({ error: "Error saving analysis to database" });
        }
      } else {
        console.log('Analysis not saved - user not authenticated. Please sign up to save your analyses.');
      }
    }

    res.json({ 
      message: 'File uploaded successfully.', 
      imagePath: filePath,
      aiResponse: aiResponse,
      processingTime: processingTime,
      savedToDatabase: !!req.user
    });
  } catch (error) {
    console.error("Error during image processing:", error);
    console.error("Error stack:", error.stack);
    console.error("Error message:", error.message);
    res.status(500).json({ error: "Error processing the image with AI.", details: error.message });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const system_prompt = `You are a helpful image analysis bot. You will be provided with an image and your goal is to extract the sentiment_rating of the image (either very positive, positive, neutral, negative, or very negative). 
Provide a short reasoning_text for the reason you chose that certain sentiment rating. Then, provide a detected_objects, which is a list of as many different objects you can detect in the image. 
The output should have JSON fields of sentiment_rating, reasoning_text, and detected_objects.
Provide a detected_objects, which is a list of as many different objects you can detect in the image. 
The output should have JSON fields of sentiment_rating and detected_objects.
Examples of output would be: {
  "sentiment_rating": "happy",
  "reasoning_text": "The person is smiling and appears relaxed. Their posture is open and positive.",
  "detected_objects": [
    "cat",
    "coffee cup",
    "laptop",
    "book"
  ]
}
for another one
{
  "sentiment_rating": "negative",
  "reasoning_text": "The person's brow is furrowed and their fists are clenched. They are standing rigidly with tense body language.",
  "detected_objects": [
    "desk",
    "phone",
    "keyboard",
    "pen"
  ]
}
`;

// Helper function to map sentiment rating to standard format
function mapSentimentRating(rating) {
  const lowerRating = rating.toLowerCase();
  if (lowerRating.includes('positive') || lowerRating.includes('happy') || lowerRating.includes('joy')) {
    return 'positive';
  } else if (lowerRating.includes('negative') || lowerRating.includes('sad') || lowerRating.includes('angry')) {
    return 'negative';
  } else {
    return 'neutral';
  }
}

async function getOpenAICompletion(base64String) {
  try {
    console.log("Making API call to OpenAI/Omnistack...");
    const completion = await openai.chat.completions.create({
      messages: [
        {
          "role": "system", 
          "content": system_prompt
        },
        {
          "role": "user", 
          "content": [
            {
              "type": "image_url",
              "image_url": {
                "url": `data:image/jpeg;base64,${base64String}`
              }
            }
          ]
        }
      ],
      model: "expressInk4omini",
      response_format: { type: "json_object" },
      max_tokens: 300
    });

    console.log("Full API Response:", completion);
    const responseContent = JSON.parse(completion.choices[0].message.content);
    console.log("Parsed Response:", responseContent);
    return responseContent;
  } catch (error) {
    console.error("Detailed Error in getOpenAICompletion:", JSON.stringify(error, null, 2));
    console.error("Error message:", error.message);
    console.error("Error response:", error.response?.data);
    
    // For now, return a mock response to test the rest of the application
    console.log("Returning mock response for testing...");
    return {
      sentiment_rating: "positive",
      reasoning_text: "This appears to be a colorful and expressive drawing with bright elements, suggesting a positive emotional state.",
      detected_objects: ["house", "sun", "tree", "person", "flower"]
    };
  }
}

const drawingPrompts = [
  "Draw a picture of yourself with your family. How do you feel in the picture?",
  "Draw a house where you feel safe. What does it look like? Who is with you?",
  "Draw a picture of your favorite place to relax. How does it make you feel?",
  "Draw a picture of a time you felt really happy. What were you doing?",
  "Draw a picture of how your day has been today. What colors or shapes do you use?",
  "Draw something that represents a challenge or problem you're facing right now.",
  "Draw a picture of your favorite thing to do when you're feeling sad. What helps you feel better?",
  "Draw a picture of a friend or someone you trust. What are they doing?",
  "Draw something that makes you feel brave or strong.",
  "Draw a picture of something you are looking forward to doing."
];

// Function to choose a random prompt from the list provided
function getRandomPrompt() {
  return drawingPrompts[Math.floor(Math.random() * drawingPrompts.length)];
}

app.get('/prompt-of-the-day', (req, res) => {
  const prompt = getRandomPrompt();
  res.json({ prompt: prompt });
});

app.get('/json-history', optionalAuth, async (req, res) => {
  try {
    // If user is authenticated, get from database
    if (req.user) {
      const analyses = await Analysis.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .select('sentimentAnalysis.overallSentiment sentimentAnalysis.keyElements createdAt')
        .limit(50);

      const formattedAnalyses = analyses.map(analysis => ({
        sentiment_rating: analysis.sentimentAnalysis.overallSentiment,
        detected_objects: analysis.sentimentAnalysis.keyElements,
        time_stamp: analysis.createdAt.toISOString()
      }));

      return res.json(formattedAnalyses);
    }

    // Fallback to file system for non-authenticated users (optional - could remove this)
    const filePath = path.join(__dirname, 'sentiment_analysis.json');
    
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath);
      const analyses = JSON.parse(fileData);
      res.json(analyses);
    } else {
      res.status(404).json({ error: "No analysis history found. Please sign up to save your analyses." });
    }
  } catch (error) {
    console.error("Error reading history:", error);
    res.status(500).json({ error: "Error getting sentiment analysis history", details: error.message });
  }
});

// New endpoint for detailed user analytics
app.get('/api/analytics/summary', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get recent analyses
    const recentAnalyses = await Analysis.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('sentimentAnalysis.overallSentiment createdAt analysisType');

    // Get sentiment distribution
    const sentimentStats = await Analysis.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$sentimentAnalysis.overallSentiment',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get timeline data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const timelineData = await Analysis.aggregate([
      { 
        $match: { 
          userId,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            sentiment: '$sentimentAnalysis.overallSentiment'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Get total counts
    const totalAnalyses = await Analysis.countDocuments({ userId });

    res.json({
      totalAnalyses,
      recentAnalyses,
      sentimentDistribution: sentimentStats,
      timelineData,
      user: {
        username: req.user.username,
        memberSince: req.user.createdAt
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Error generating analytics' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
