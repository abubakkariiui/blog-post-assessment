const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Post = require('../models/Post');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validatePost = [
    body('title')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),
    body('body')
        .isLength({ min: 10 })
        .withMessage('Body must be at least 10 characters long')
];

const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 and 50')
];

// Get all posts with pagination
router.get('/', validatePagination, optionalAuth, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: errors.array() 
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        // Build query
        const query = { status: 'published' };
        
        // Add search functionality
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }

        // Get posts with pagination
        const posts = await Post.find(query)
            .sort({ publishedDate: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count
        const total = await Post.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.json({
            data: posts,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({
            error: 'Failed to fetch posts',
            message: 'An error occurred while fetching posts'
        });
    }
});

// Get single post by ID
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({
                error: 'Post not found',
                message: 'The requested post does not exist'
            });
        }

        // Check if user can view draft posts
        if (post.status === 'draft' && (!req.user || req.user._id.toString() !== post.author._id.toString())) {
            return res.status(403).json({
                error: 'Access denied',
                message: 'You do not have permission to view this post'
            });
        }

        res.json(post);

    } catch (error) {
        console.error('Get post error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                error: 'Post not found',
                message: 'Invalid post ID'
            });
        }
        res.status(500).json({
            error: 'Failed to fetch post',
            message: 'An error occurred while fetching the post'
        });
    }
});

// Create new post (authenticated)
router.post('/', auth, validatePost, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: errors.array() 
            });
        }

        const { title, body, status = 'published', tags = [] } = req.body;

        const post = new Post({
            title,
            body,
            status,
            tags,
            author: req.user._id
        });

        await post.save();

        res.status(201).json({
            message: 'Post created successfully',
            post
        });

    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
            error: 'Failed to create post',
            message: 'An error occurred while creating the post'
        });
    }
});

// Update post (authenticated, author only)
router.put('/:id', auth, validatePost, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: errors.array() 
            });
        }

        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({
                error: 'Post not found',
                message: 'The requested post does not exist'
            });
        }

        // Check if user is the author
        if (post.author._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                error: 'Access denied',
                message: 'You can only edit your own posts'
            });
        }

        const { title, body, status, tags } = req.body;

        // Update post
        post.title = title || post.title;
        post.body = body || post.body;
        post.status = status || post.status;
        post.tags = tags || post.tags;

        await post.save();

        res.json({
            message: 'Post updated successfully',
            post
        });

    } catch (error) {
        console.error('Update post error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                error: 'Post not found',
                message: 'Invalid post ID'
            });
        }
        res.status(500).json({
            error: 'Failed to update post',
            message: 'An error occurred while updating the post'
        });
    }
});

// Delete post (authenticated, author only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({
                error: 'Post not found',
                message: 'The requested post does not exist'
            });
        }

        // Check if user is the author
        if (post.author._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                error: 'Access denied',
                message: 'You can only delete your own posts'
            });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Post deleted successfully'
        });

    } catch (error) {
        console.error('Delete post error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                error: 'Post not found',
                message: 'Invalid post ID'
            });
        }
        res.status(500).json({
            error: 'Failed to delete post',
            message: 'An error occurred while deleting the post'
        });
    }
});

// Get posts by author
router.get('/author/:authorId', validatePagination, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: errors.array() 
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ 
            author: req.params.authorId,
            status: 'published'
        })
        .sort({ publishedDate: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Post.countDocuments({ 
            author: req.params.authorId,
            status: 'published'
        });
        const totalPages = Math.ceil(total / limit);

        res.json({
            data: posts,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get author posts error:', error);
        res.status(500).json({
            error: 'Failed to fetch author posts',
            message: 'An error occurred while fetching posts'
        });
    }
});

module.exports = router; 