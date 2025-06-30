# Task Manager Frontend

A modern, responsive task management application built with React, Tailwind CSS, and featuring a beautiful dark/light mode interface.

## ✨ Features

### 🎨 UI/UX Improvements
- **Dark/Light Mode**: Toggle between themes with persistent storage
- **Responsive Design**: Mobile-first approach with beautiful responsive layouts
- **Modern Interface**: Clean, professional design with smooth animations
- **Accessibility**: Proper ARIA labels, keyboard navigation, and focus management

### 📱 Components
- **Enhanced Dashboard**: Comprehensive task management with statistics, filtering, and search
- **Improved Forms**: Better login/signup forms with validation and social login options
- **Settings Panel**: Multi-tab settings with profile, notifications, privacy, and appearance options
- **Navigation**: Responsive navbar with mobile menu and theme toggle

### 🔧 Technical Features
- **Theme Context**: Centralized theme management with localStorage persistence
- **API Integration**: Ready-to-use API service for backend communication
- **Component Library**: Reusable UI components with consistent styling
- **Form Validation**: Client-side validation with visual feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

### Backend Setup
Make sure your backend server is running on `http://localhost:5000` before testing API functionality.

## 🎯 Key Features

### Dashboard
- **Task Statistics**: Visual cards showing total, in-progress, completed, and pending tasks
- **Task Management**: Create, edit, delete, and filter tasks
- **Search & Filter**: Real-time search and status-based filtering
- **Task Details**: Priority levels, due dates, categories, and tags

### Authentication
- **Login/Signup**: Beautiful forms with password visibility toggle
- **Social Login**: Google and GitHub integration (UI ready)
- **Form Validation**: Real-time validation with error messages
- **Remember Me**: Persistent login functionality

### Settings
- **Profile Management**: Update personal information and bio
- **Notification Preferences**: Email, push, and SMS notification settings
- **Privacy Controls**: Profile visibility and activity status settings
- **Theme Settings**: Dark/light mode toggle with live preview
- **Data Management**: Export data and account deletion options

## 🎨 Theme System

The application uses a sophisticated theme system:

- **Automatic Detection**: Detects user's system preference
- **Persistent Storage**: Remembers user's theme choice
- **Smooth Transitions**: Animated theme switching
- **Consistent Styling**: All components support both themes

### Theme Classes
- `dark:` prefix for dark mode styles
- `transition-colors` for smooth theme switching
- Consistent color palette across components

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first approach**
- **Breakpoint system**: sm, md, lg, xl
- **Flexible layouts**: Grid and flexbox for optimal display
- **Touch-friendly**: Proper touch targets and gestures

## 🔌 API Integration

The application includes a comprehensive API service:

```javascript
import api from './services/api';

// Example usage
const tasks = await api.getTasks();
const newTask = await api.createTask(taskData);
```

### Available Endpoints
- **Authentication**: login, register, logout
- **Tasks**: CRUD operations, filtering, assignment
- **Users**: Profile management
- **Notifications**: Get, mark as read, delete

## 🛠️ Customization

### Adding New Components
1. Create component in `src/components/`
2. Use the provided utility classes
3. Include dark mode support
4. Add proper TypeScript types (if using TS)

### Styling
- Use Tailwind CSS classes
- Follow the established design system
- Include dark mode variants
- Use the provided component classes

### Theme Colors
```css
/* Primary colors */
--color-primary-50: #eff6ff
--color-primary-600: #2563eb
--color-primary-900: #1e3a8a

/* Dark mode colors */
--color-gray-800: #1f2937
--color-gray-900: #111827
```

## 📦 Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React contexts (ThemeContext)
├── layout/             # Layout components (Navbar)
├── pages/              # Page components
├── services/           # API services
├── App.jsx            # Main application component
├── index.css          # Global styles and Tailwind
└── main.jsx           # Application entry point
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🤝 Contributing

1. Follow the established code style
2. Include dark mode support for new components
3. Add proper error handling
4. Test on multiple screen sizes
5. Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies**
