const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    body: {
        type: String,
        required: [true, 'Body is required'],
        minlength: [10, 'Body must be at least 10 characters long']
    },
    excerpt: {
        type: String,
        maxlength: [200, 'Excerpt cannot exceed 200 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    publishedDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    },
    tags: [{
        type: String,
        trim: true
    }],
    readTime: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Generate excerpt from body if not provided
postSchema.pre('save', function(next) {
    if (!this.excerpt && this.body) {
        this.excerpt = this.body.substring(0, 200).trim();
        if (this.body.length > 200) {
            this.excerpt += '...';
        }
    }
    
    // Calculate read time (rough estimate: 200 words per minute)
    if (this.body) {
        const wordCount = this.body.split(/\s+/).length;
        this.readTime = Math.ceil(wordCount / 200);
    }
    
    next();
});

// Populate author when querying posts
postSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'author',
        select: 'username email'
    });
    next();
});

// Index for better query performance
postSchema.index({ title: 'text', body: 'text' });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ status: 1, publishedDate: -1 });

module.exports = mongoose.model('Post', postSchema); 