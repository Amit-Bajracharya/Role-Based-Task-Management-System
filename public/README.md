# Task Management System - Frontend

A beautiful, modern frontend for the Task Management System built with HTML, CSS, and JavaScript.

## 🎨 Features

### Authentication
- ✅ User Login with beautiful form
- ✅ User Registration with role selection
- ✅ Navigation between auth pages
- ✅ Logout functionality

### Dashboard
- ✅ Task Statistics (Pending, In Progress, Completed)
- ✅ Task Filtering by status
- ✅ Task Creation, Read, Update, Delete (CRUD)
- ✅ Modal-based task editing
- ✅ Responsive design

### UI/UX
- ✅ Modern gradient design
- ✅ Smooth animations and transitions
- ✅ Toast notifications
- ✅ Loading overlays
- ✅ Hover effects and micro-interactions
- ✅ Mobile responsive design
- ✅ Professional color scheme

## 📁 File Structure

```
public/
├── index.html      # Main HTML file
├── styles.css      # Complete styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## 🚀 How to Use

### 1. Start Your Backend Server
```bash
cd "d:\Amit\node\Task-Managment System"
node app.js
```

### 2. Open the Frontend
Open `index.html` in your browser or serve it with a web server.

### 3. Test the Features

#### Authentication Flow:
1. **Register** a new account
2. **Login** with your credentials
3. **Access** the dashboard

#### Task Management:
1. **View** task statistics
2. **Create** new tasks with title, description, status, priority, and due date
3. **Filter** tasks by status
4. **Edit** existing tasks
5. **Delete** tasks

## 🎯 Design Highlights

### Visual Design
- **Gradient backgrounds** with purple/blue theme
- **Card-based layouts** with subtle shadows
- **Icon integration** using Font Awesome
- **Consistent spacing** and typography

### Interactive Elements
- **Smooth transitions** on all interactive elements
- **Hover effects** on buttons and cards
- **Modal animations** for task editing
- **Toast notifications** for user feedback
- **Loading states** for async operations

### Responsive Design
- **Mobile-first approach**
- **Flexible grid layouts**
- **Adaptive navigation**
- **Touch-friendly buttons**

## 🔧 Current Implementation

### Simulated API Calls
The frontend currently uses simulated API calls that return mock data. To connect to your actual backend:

1. **Replace the simulated functions** in `script.js`:
   - `simulateLogin()` → Actual login API call
   - `simulateRegister()` → Actual registration API call
   - `simulateGetTasks()` → Actual get tasks API call
   - `simulateCreateTask()` → Actual create task API call
   - `simulateUpdateTask()` → Actual update task API call
   - `simulateDeleteTask()` → Actual delete task API call

### Example API Integration:
```javascript
// Replace simulateLogin() with:
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    showLoading(true);

    try {
        const response = await fetch('http://localhost:5000/user/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.data.user;
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            
            showToast('Login successful!', 'success');
            showSection('dashboard');
            updateNavigation();
        } else {
            showToast(data.data, 'error');
        }
    } catch (error) {
        showToast('Login failed. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}
```

## 🎨 CSS Features

### Modern Styling
- **CSS Grid** and **Flexbox** for layouts
- **CSS Variables** for consistent theming
- **Backdrop filters** for glassmorphism effects
- **Custom animations** and keyframes

### Component-Based CSS
- **Modular CSS** with clear component separation
- **Reusable classes** for common patterns
- **Responsive utilities** for mobile design
- **State-based styling** for interactive elements

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🎯 Next Steps

1. **Connect to Backend API**
2. **Add JWT Token Management**
3. **Implement Token Refresh**
4. **Add Form Validation**
5. **Enhance Error Handling**
6. **Add More Task Features**
7. **Implement Search/Filter**
8. **Add Task Categories**

## 🎉 Ready to Use!

Your frontend is now ready with:
- Beautiful, modern design
- Complete task management UI
- Responsive layout
- Smooth interactions
- Professional appearance

Simply open `index.html` in your browser to see the stunning interface! 🚀
