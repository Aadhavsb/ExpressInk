const express = require('express');
const { body, validationResult } = require('express-validator');
const Analysis = require('../models/Analysis');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analysis
// @desc    Get user's analyses with pagination and filtering
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sentiment,
      analysisType,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = { userId: req.user._id };
    if (sentiment) filter['sentimentAnalysis.overallSentiment'] = sentiment;
    if (analysisType) filter.analysisType = analysisType;

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const analyses = await Analysis.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-aiResponse'); // Exclude large AI response data

    const total = await Analysis.countDocuments(filter);

    res.json({
      analyses,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: analyses.length,
        totalItems: total
      }
    });

  } catch (error) {
    console.error('Get analyses error:', error);
    res.status(500).json({ error: 'Server error while fetching analyses' });
  }
});

// @route   GET /api/analysis/:id
// @desc    Get specific analysis by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json(analysis);

  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: 'Server error while fetching analysis' });
  }
});

// @route   POST /api/analysis
// @desc    Create new analysis
// @access  Private
router.post('/', [
  auth,
  body('imageUrl').notEmpty().withMessage('Image URL is required'),
  body('originalFilename').notEmpty().withMessage('Original filename is required'),
  body('filename').notEmpty().withMessage('Filename is required'),
  body('analysisType').isIn(['upload', 'drawing']).withMessage('Invalid analysis type'),
  body('sentimentAnalysis.overallSentiment').isIn(['positive', 'negative', 'neutral']).withMessage('Invalid sentiment'),
  body('sentimentAnalysis.confidence').isFloat({ min: 0, max: 1 }).withMessage('Confidence must be between 0 and 1'),
  body('aiResponse').notEmpty().withMessage('AI response is required'),
  body('processingTime').isNumeric().withMessage('Processing time must be numeric')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array()
      });
    }

    const analysisData = {
      ...req.body,
      userId: req.user._id
    };

    const analysis = new Analysis(analysisData);
    await analysis.save();

    res.status(201).json({
      message: 'Analysis saved successfully',
      analysis
    });

  } catch (error) {
    console.error('Create analysis error:', error);
    res.status(500).json({ error: 'Server error while saving analysis' });
  }
});

// @route   PUT /api/analysis/:id
// @desc    Update analysis (tags, privacy settings)
// @access  Private
router.put('/:id', [
  auth,
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('isPrivate').optional().isBoolean().withMessage('isPrivate must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array()
      });
    }

    const { tags, isPrivate } = req.body;
    
    const analysis = await Analysis.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { 
        ...(tags !== undefined && { tags }),
        ...(isPrivate !== undefined && { isPrivate })
      },
      { new: true }
    );

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({
      message: 'Analysis updated successfully',
      analysis
    });

  } catch (error) {
    console.error('Update analysis error:', error);
    res.status(500).json({ error: 'Server error while updating analysis' });
  }
});

// @route   DELETE /api/analysis/:id
// @desc    Delete analysis
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json({ message: 'Analysis deleted successfully' });

  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ error: 'Server error while deleting analysis' });
  }
});

// @route   GET /api/analysis/stats/summary
// @desc    Get user's analysis statistics
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Aggregate statistics
    const stats = await Analysis.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalAnalyses: { $sum: 1 },
          positiveCount: {
            $sum: {
              $cond: [{ $eq: ['$sentimentAnalysis.overallSentiment', 'positive'] }, 1, 0]
            }
          },
          negativeCount: {
            $sum: {
              $cond: [{ $eq: ['$sentimentAnalysis.overallSentiment', 'negative'] }, 1, 0]
            }
          },
          neutralCount: {
            $sum: {
              $cond: [{ $eq: ['$sentimentAnalysis.overallSentiment', 'neutral'] }, 1, 0]
            }
          },
          uploadCount: {
            $sum: {
              $cond: [{ $eq: ['$analysisType', 'upload'] }, 1, 0]
            }
          },
          drawingCount: {
            $sum: {
              $cond: [{ $eq: ['$analysisType', 'drawing'] }, 1, 0]
            }
          },
          avgConfidence: { $avg: '$sentimentAnalysis.confidence' },
          avgProcessingTime: { $avg: '$processingTime' }
        }
      }
    ]);

    const result = stats[0] || {
      totalAnalyses: 0,
      positiveCount: 0,
      negativeCount: 0,
      neutralCount: 0,
      uploadCount: 0,
      drawingCount: 0,
      avgConfidence: 0,
      avgProcessingTime: 0
    };

    res.json(result);

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error while fetching statistics' });
  }
});

module.exports = router;
