# Task Manager - Full Stack Application

A modern, feature-rich task management application built with React, Node.js, and MongoDB. Features real-time notifications, dark/light mode, and comprehensive task management capabilities.

## 🌟 Features

### 🔐 Authentication & User Management
- **User Registration & Login** with JWT authentication
- **Profile Management** - Update name, bio, and avatar
- **User Settings** - Customizable notification and privacy preferences
- **Data Export/Import** - Download and restore user data as JSON

### 📋 Task Management
- **Create, Read, Update, Delete** tasks with rich metadata
- **Task Assignment** - Assign tasks to other users
- **Status Management** - Track task progress (Pending, In Progress, Completed)
- **Soft Delete** - Recover deleted tasks from trash
- **Task Filtering** - Filter by status, priority, due date
- **Search Functionality** - Search tasks by title, description, or tags
- **Due Date Management** - Set and track task deadlines
- **Tag System** - Organize tasks with colorful tags

### 🔔 Real-time Notifications
- **Instant Notifications** - Real-time updates using Socket.io
- **Notification Types** - System, Task, Update, and Reminder notifications
- **Priority Levels** - High, Medium, Low priority notifications
- **Notification Management** - Mark as read, delete individual, clear all
- **Daily Reminders** - Automated daily reminders for due/overdue tasks
- **User Preferences** - Enable/disable notification types

### 🎨 User Interface
- **Dark/Light Mode** - Toggle between themes with persistent preference
- **Responsive Design** - Mobile-first design that works on all devices
- **Modern UI** - Clean, intuitive interface with Tailwind CSS
- **Toast Notifications** - Beautiful in-app notifications using react-toastify
- **Loading States** - Smooth loading indicators and error handling

### 📱 Pages & Navigation
- **Homepage** - Landing page with login/signup options
- **Dashboard** - Main task overview with statistics and filters
- **New Task** - Dedicated page for creating tasks
- **Edit Task** - Full-featured task editing interface
- **Assigned Tasks** - View tasks assigned by other users
- **Recently Deleted** - Manage and restore deleted tasks
- **Notifications** - Centralized notification center
- **Profile** - User profile management
- **Settings** - Multi-tab settings interface

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Beautiful icon library
- **React Toastify** - Toast notification system
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Socket.io** - Real-time bidirectional communication
- **node-cron** - Task scheduling for daily reminders
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
task_manager/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React context providers
│   │   │   ├── ThemeContext.jsx
│   │   │   └── UserContext.jsx
│   │   ├── layout/           # Layout components
│   │   │   └── Navbar.jsx
│   │   ├── pages/            # Application pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── NewTask.jsx
│   │   │   ├── EditTask.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── RecentlyDeleted.jsx
│   │   │   └── AssignedTasks.jsx
│   │   ├── services/         # API and utility services
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   └── App.jsx           # Main application component
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js backend application
│   ├── config/
│   │   └── db.js            # Database configuration
│   ├── controllers/         # Route controllers
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   ├── userController.js
│   │   ├── notificationController.js
│   │   └── userSettingsController.js
│   ├── middleware/
│   │   └── authMiddleware.js # JWT authentication middleware
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Notification.js
│   │   └── UserSettings.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── userRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── userSettingsRoutes.js
│   ├── socket/              # Socket.io handlers
│   │   ├── socketHandler.js
│   │   └── socketInstance.js
│   ├── server.js            # Main server file
│   └── package.json
└── README.md               # This file
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd task_manager
```

### Step 2: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure Environment Variables** (`.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task_manager
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**Start the backend:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Step 3: Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
echo "VITE_API_BASE_URL=http://localhost:5000" > .env
```

**Start the frontend:**
```bash
npm run dev
```

### Step 4: Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Task Endpoints

#### GET `/api/tasks`
Get all tasks for the authenticated user
- **Query Parameters:** `status`, `priority`, `dueDate`, `search`

#### POST `/api/tasks`
Create a new task
```json
{
  "title": "Task Title",
  "description": "Task description",
  "priority": "high",
  "dueDate": "2024-01-15",
  "tags": ["work", "urgent"],
  "assignedTo": "user@example.com"
}
```

#### PUT `/api/tasks/:id`
Update a task

#### DELETE `/api/tasks/:id`
Soft delete a task

#### PUT `/api/tasks/:id/status`
Update task status
```json
{
  "status": "completed"
}
```

#### GET `/api/tasks/assigned`
Get tasks assigned to the authenticated user

#### GET `/api/tasks/deleted`
Get soft-deleted tasks

#### PUT `/api/tasks/restore/:id`
Restore a deleted task

#### DELETE `/api/tasks/permanent/:id`
Permanently delete a task

### User Endpoints

#### GET `/api/users/profile`
Get user profile

#### PUT `/api/users/profile`
Update user profile (supports multipart/form-data for avatar)

#### GET `/api/users/export`
Export user data as JSON

#### DELETE `/api/users/delete`
Delete user account

#### POST `/api/users/import`
Import user data from JSON file

### Notification Endpoints

#### GET `/api/notifications`
Get user notifications

#### PUT `/api/notifications/:id/read`
Mark notification as read

#### DELETE `/api/notifications/:id`
Delete a notification

#### DELETE `/api/notifications/clear-all`
Clear all notifications

### User Settings Endpoints

#### GET `/api/user-settings`
Get user settings

#### PUT `/api/user-settings`
Update user settings
```json
{
  "notifications": {
    "dailyReminders": true,
    "general": true
  },
  "privacy": {
    "profileVisibility": "public",
    "showEmail": false,
    "showActivity": true,
    "allowTaskAssignment": true
  }
}
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000                          # Server port
MONGODB_URI=mongodb://localhost:27017/task_manager
JWT_SECRET=your_secret_key         # JWT signing secret
NODE_ENV=development               # Environment mode
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000  # Backend API URL
```

### Database Schema

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  bio: String,
  avatar: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

#### Task Model
```javascript
{
  title: String,
  description: String,
  status: String (pending, in-progress, completed),
  priority: String (low, medium, high),
  dueDate: Date,
  tags: [String],
  assignedTo: String (email),
  user: ObjectId (creator),
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Notification Model
```javascript
{
  user: ObjectId,
  title: String,
  message: String,
  type: String (system, task, update, reminder),
  priority: String (low, medium, high),
  isRead: Boolean,
  createdAt: Date
}
```

#### UserSettings Model
```javascript
{
  user: ObjectId,
  notifications: {
    dailyReminders: Boolean,
    general: Boolean
  },
  privacy: {
    profileVisibility: String (public, private),
    showEmail: Boolean,
    showActivity: Boolean,
    allowTaskAssignment: Boolean
  }
}
```

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. **Add Environment Variables:**
   - `MONGODB_URI` (your MongoDB connection string)
   - `JWT_SECRET` (your secret key)
   - `NODE_ENV=production`

### Frontend Deployment (Vercel/Netlify)

1. **Connect your GitHub repository**
2. **Set build settings:**
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. **Add Environment Variables:**
   - `VITE_API_BASE_URL` (your deployed backend URL)

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **CORS Protection** - Configured cross-origin requests
- **Input Validation** - Server-side validation for all inputs
- **Rate Limiting** - Protection against brute force attacks
- **Environment Variables** - Secure configuration management

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Include error messages, steps to reproduce, and environment details

## 🎯 Roadmap

- [ ] **Mobile App** - React Native version
- [ ] **Team Collaboration** - Team workspaces and shared tasks
- [ ] **Advanced Analytics** - Task completion analytics and reports
- [ ] **Calendar Integration** - Google Calendar sync
- [ ] **Email Notifications** - Email reminders and updates
- [ ] **File Attachments** - Attach files to tasks
- [ ] **Time Tracking** - Track time spent on tasks
- [ ] **API Rate Limiting** - Implement rate limiting for API endpoints
- [ ] **Unit Tests** - Comprehensive test coverage
- [ ] **E2E Tests** - End-to-end testing with Cypress

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Socket.io** - For real-time communication capabilities
- **MongoDB** - For the flexible NoSQL database
- **Render** - For hosting the backend application

---

**Made with ❤️ by [Your Name]** 