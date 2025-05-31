const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  analysisType: {
    type: String,
    enum: ['upload', 'drawing'],
    required: true
  },
  sentimentAnalysis: {
    overallSentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      required: true
    },
    emotions: [{
      emotion: {
        type: String,
        enum: ['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral'],
        required: true
      },
      intensity: {
        type: Number,
        min: 0,
        max: 1,
        required: true
      }
    }],
    detailedAnalysis: {
      type: String,
      required: true
    },
    keyElements: [{
      type: String
    }],
    suggestedActions: [{
      type: String
    }]
  },
  aiResponse: {
    type: String,
    required: true
  },
  processingTime: {
    type: Number, // in milliseconds
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPrivate: {
    type: Boolean,
    default: true
  }
});

// Index for faster queries
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ overallSentiment: 1 });

module.exports = mongoose.model('Analysis', analysisSchema);
