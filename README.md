# Blog Application with Angular 19 and Sakai-NG

A modern blog application built with Angular 19, PrimeNG, AG Grid, and Express.js backend with MongoDB.

## 🚀 Features

### Frontend (Angular 19 + Sakai-NG)
- **Home Page**: Paginated AG Grid displaying blog posts (5 per page)
- **Post Detail Page**: Full blog post view with author and date
- **Create Post Page**: Authenticated form for creating new posts
- **Authentication**: Login/Register with JWT tokens
- **Responsive Design**: Modern UI using PrimeNG components
- **Route Guards**: Protected routes for authenticated users

### Backend (Express.js + MongoDB)
- **RESTful API**: Complete CRUD operations for blog posts
- **JWT Authentication**: Secure user authentication and authorization
- **MongoDB Integration**: Data persistence with Mongoose ODM
- **Input Validation**: Request validation using express-validator
- **Pagination**: Efficient data pagination for large datasets
- **Search Functionality**: Text search across posts (backend API ready)

## 🛠 Tech Stack

### Frontend
- **Angular 19** - Latest Angular framework
- **Sakai-NG** - PrimeNG-based UI starter template
- **PrimeNG** - Rich UI component library
- **AG Grid** - Advanced data grid for tabular display
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Helmet.js** - Security headers
- **Morgan** - HTTP request logger

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Angular CLI (v19)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sakai-ng
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at `http://localhost:4200`

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:3000`

### 4. MongoDB Setup
You can use either:
- **Local MongoDB**: Install and run MongoDB locally
- **MongoDB Atlas**: Use cloud MongoDB service

Update the `MONGODB_URI` in your `.env` file accordingly.

## 🔧 Configuration

### Environment Variables (Backend)
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/blog-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration
CORS_ORIGIN=http://localhost:4200

# Optional: MongoDB Atlas (if using cloud database)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-app?retryWrites=true&w=majority
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - User logout

#### Blog Posts
- `GET /api/posts` - Get paginated posts (supports search via `?search=query`)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (authenticated)
- `PUT /api/posts/:id` - Update post (authenticated, author only)
- `DELETE /api/posts/:id` - Delete post (authenticated, author only)
- `GET /api/posts/author/:authorId` - Get posts by author

## 🎯 Core Features Implementation

### 1. AG Grid Integration
- Paginated display (5 posts per page)
- Sortable columns
- Responsive design
- Custom cell renderers for titles and excerpts
- Custom pagination controls

### 2. Authentication Flow
- JWT-based authentication
- Route guards for protected pages
- Profile dropdown in topbar
- Automatic token validation
- Login/Register forms with validation

### 3. Blog Post Management
- Create, read, update, delete operations
- Author-based permissions
- Automatic excerpt generation
- Read time calculation
- Markdown-style content formatting

### 4. PrimeNG Components
- Forms with validation
- Cards and layouts
- Buttons and navigation
- Messages and notifications
- Theme configurator with dark mode

## 🚀 Bonus Features

### AI-Assisted Development
- **Cursor Integration**: Used AI tools for code generation and optimization
- **Prompt Engineering**: Structured prompts for consistent development
- **Code Review**: AI-assisted code review and improvements

### Advanced Features
- **Optimistic UI Updates**: Immediate feedback on post creation
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling and user feedback
- **Responsive Design**: Mobile-friendly interface
- **Search Functionality**: Backend API ready for text search across posts
- **Author Permissions**: Role-based access control
- **Theme Support**: Dark/Light mode switching
- **Loading States**: Proper loading indicators throughout the app

## 📁 Project Structure

```
sakai-ng/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── auth/           # Authentication pages
│   │   │   │   ├── login.ts
│   │   │   │   ├── register.ts
│   │   │   │   └── auth.routes.ts
│   │   │   └── blog/           # Blog components
│   │   │       ├── blog.home.ts
│   │   │       ├── blog.post.detail.ts
│   │   │       ├── blog.create.post.ts
│   │   │       └── blog.routes.ts
│   │   ├── services/           # API services
│   │   │   ├── auth.service.ts
│   │   │   └── blog.service.ts
│   │   ├── guards/             # Route guards
│   │   │   └── auth.guard.ts
│   │   └── layout/             # Layout components
│   └── assets/
├── backend/
│   ├── models/                 # MongoDB models
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   └── posts.js
│   ├── middleware/             # Custom middleware
│   │   └── auth.js
│   ├── server.js               # Main server file
│   └── package.json
└── README.md
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing
- **Helmet.js**: Security headers
- **Rate Limiting**: Protection against abuse (can be added)

## 🧪 Testing

### Frontend Testing
```bash
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
npm start
# Deploy to your preferred hosting service (Heroku, Vercel, etc.)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **PrimeNG Team** - For the excellent UI components
- **AG Grid Team** - For the powerful data grid
- **Angular Team** - For the amazing framework
- **Express.js Team** - For the robust backend framework

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Built with ❤️ using Angular 19, PrimeNG, and Express.js**
