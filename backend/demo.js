const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blog-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB for demo'))
.catch(err => console.error('MongoDB connection error:', err));

async function createDemoData() {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        
        console.log('Cleared existing data');
        
        // Create demo users
        const user1 = new User({
            username: 'johndoe',
            email: 'john@example.com',
            password: 'password123'
        });
        
        const user2 = new User({
            username: 'janesmith',
            email: 'jane@example.com',
            password: 'password123'
        });
        
        await user1.save();
        await user2.save();
        
        console.log('Created demo users');
        
        // Create demo posts
        const post1 = new Post({
            title: 'Getting Started with Angular 17',
            body: `Angular 17 introduces many new features that make it easier to build modern web applications. In this comprehensive guide, we'll explore the key improvements and how to leverage them in your projects.

## Key Features

### Standalone Components
Angular 17 makes it easier to create standalone components that don't require NgModules. This simplifies the development process and reduces bundle size.

### Improved Performance
The new version includes significant performance improvements, including faster compilation times and better runtime performance.

### Enhanced Developer Experience
With better error messages, improved debugging tools, and enhanced TypeScript support, Angular 17 provides a much better development experience.

## Getting Started

To create a new Angular 17 project, run:

\`\`\`bash
npm install -g @angular/cli@latest
ng new my-app
cd my-app
ng serve
\`\`\`

This will create a new Angular project with all the latest features enabled.

## Migration Guide

If you're upgrading from a previous version, check out the official migration guide for step-by-step instructions on updating your existing applications.

The future of Angular development is here, and it's more exciting than ever!`,
            author: user1._id
        });
        
        const post2 = new Post({
            title: 'Building Modern UIs with PrimeNG',
            body: `PrimeNG is a comprehensive UI component library for Angular that provides over 90 components. It's designed to help developers build beautiful and responsive user interfaces quickly and efficiently.

## Why Choose PrimeNG?

### Rich Component Library
With over 90 components, PrimeNG covers almost every UI need you might have in a modern web application.

### Consistent Design
All components follow a consistent design language, ensuring your application looks professional and cohesive.

### Accessibility
PrimeNG components are built with accessibility in mind, making your applications usable by everyone.

## Getting Started

Install PrimeNG in your Angular project:

\`\`\`bash
npm install primeng primeicons
\`\`\`

Then import the components you need in your module or standalone component.

## Popular Components

- **DataTable**: For displaying tabular data with sorting, filtering, and pagination
- **Dialog**: For modal dialogs and overlays
- **Calendar**: For date and time selection
- **Chart**: For data visualization
- **FileUpload**: For file upload functionality

PrimeNG makes Angular development faster and more enjoyable!`,
            author: user2._id
        });
        
        const post3 = new Post({
            title: 'AG Grid for Data Management',
            body: `AG Grid is the most powerful data grid component for Angular applications. Learn how to implement advanced features like sorting, filtering, and pagination.

AG Grid provides enterprise-level features that make data management a breeze. From simple data display to complex interactive grids, AG Grid has you covered.

## Key Features

- **Sorting and Filtering**: Built-in sorting and filtering capabilities
- **Pagination**: Efficient pagination for large datasets
- **Column Resizing**: Drag to resize columns
- **Row Selection**: Single and multiple row selection
- **Export**: Export data to various formats
- **Custom Cell Renderers**: Create custom cell content

## Getting Started

Install AG Grid:

\`\`\`bash
npm install ag-grid-angular ag-grid-community
\`\`\`

Then import the modules in your component and start building powerful data grids!`,
            author: user1._id
        });
        
        await post1.save();
        await post2.save();
        await post3.save();
        
        console.log('Created demo posts');
        console.log('\nDemo data created successfully!');
        console.log('\nYou can now:');
        console.log('1. Start the server: npm run dev');
        console.log('2. Test the API endpoints');
        console.log('3. Use the frontend to view the blog');
        
        process.exit(0);
        
    } catch (error) {
        console.error('Error creating demo data:', error);
        process.exit(1);
    }
}

createDemoData(); 