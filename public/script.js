// Global Variables
let currentUser = null;
let tasks = [];
let currentEditTaskId = null;

// DOM Elements
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const dashboardSection = document.getElementById('dashboardSection');

const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const dashboardBtn = document.getElementById('dashboardBtn');
const logoutBtn = document.getElementById('logoutBtn');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const taskForm = document.getElementById('taskForm');

const taskModal = document.getElementById('taskModal');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');
const cancelModal = document.getElementById('cancelModal');
const addTaskBtn = document.getElementById('addTaskBtn');

const loadingOverlay = document.getElementById('loadingOverlay');
const toast = document.getElementById('toast');
const toastIcon = document.getElementById('toastIcon');
const toastMessage = document.getElementById('toastMessage');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    showSection('login');
});

// Event Listeners
function setupEventListeners() {
    // Navigation
    loginBtn.addEventListener('click', () => showSection('login'));
    registerBtn.addEventListener('click', () => showSection('register'));
    dashboardBtn.addEventListener('click', () => showSection('dashboard'));
    logoutBtn.addEventListener('click', logout);

    // Auth Forms
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);

    // Task Modal
    addTaskBtn.addEventListener('click', openAddTaskModal);
    closeModal.addEventListener('click', closeTaskModal);
    cancelModal.addEventListener('click', closeTaskModal);
    taskForm.addEventListener('submit', handleTaskSubmit);

    // Auth Links
    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('register');
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login');
    });

    // Task Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => filterTasks(btn.dataset.filter));
    });

    // Modal backdrop click
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            closeTaskModal();
        }
    });
}

// Section Management
function showSection(section) {
    // Hide all sections
    loginSection.classList.remove('active');
    registerSection.classList.remove('active');
    dashboardSection.classList.remove('active');

    // Remove active class from nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected section
    switch(section) {
        case 'login':
            loginSection.classList.add('active');
            loginBtn.classList.add('active');
            break;
        case 'register':
            registerSection.classList.add('active');
            registerBtn.classList.add('active');
            break;
        case 'dashboard':
            dashboardSection.classList.add('active');
            dashboardBtn.classList.add('active');
            if (currentUser) {
                loadTasks();
            }
            break;
    }
}

// Authentication Functions
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
            showToast(typeof data.data === 'string' ? data.data : 'Login failed', 'error');
        }
    } catch (error) {
        showToast('Login failed. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    showLoading(true);

    try {
        const response = await fetch('http://localhost:5000/user/api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, role })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Registration successful! Please login.', 'success');
            registerForm.reset();
            showSection('login');
        } else {
            showToast(typeof data.data === 'string' ? data.data : 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('Registration failed. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    showToast('Logged out successfully!', 'info');
    showSection('login');
    updateNavigation();
}

function updateNavigation() {
    if (currentUser) {
        loginBtn.classList.add('hidden');
        registerBtn.classList.add('hidden');
        dashboardBtn.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
    } else {
        loginBtn.classList.remove('hidden');
        registerBtn.classList.remove('hidden');
        dashboardBtn.classList.add('hidden');
        logoutBtn.classList.add('hidden');
    }
}

// Task Management Functions
function openAddTaskModal() {
    currentEditTaskId = null;
    modalTitle.textContent = 'Add New Task';
    taskForm.reset();
    taskModal.classList.add('active');
}

function openEditTaskModal(taskId) {
    currentEditTaskId = taskId;
    const task = tasks.find(t => t._id === taskId);
    
    if (task) {
        modalTitle.textContent = 'Edit Task';
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskStatus').value = task.status;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskDueDate').value = task.dueDate ? task.dueDate.split('T')[0] : '';
        
        taskModal.classList.add('active');
    }
}

function closeTaskModal() {
    taskModal.classList.remove('active');
    taskForm.reset();
    currentEditTaskId = null;
}

async function handleTaskSubmit(e) {
    e.preventDefault();
    
    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        status: document.getElementById('taskStatus').value,
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDueDate').value
    };

    showLoading(true);

    try {
        const token = localStorage.getItem('token');
        let response;
        
        if (currentEditTaskId) {
            // Update task
            response = await fetch(`http://localhost:5000/tasks/api/${currentEditTaskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });
        } else {
            // Create task
            response = await fetch('http://localhost:5000/tasks/api', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });
        }
        
        const data = await response.json();
        
        if (data.success) {
            showToast(currentEditTaskId ? 'Task updated successfully!' : 'Task created successfully!', 'success');
            closeTaskModal();
            loadTasks();
        } else {
            showToast(typeof data.data === 'string' ? data.data : 'Task operation failed', 'error');
        }
    } catch (error) {
        showToast('Task operation failed. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

async function loadTasks() {
    showLoading(true);

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/tasks/api', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            tasks = data.data;
            renderTasks();
            updateTaskStats();
        } else {
            showToast(typeof data.data === 'string' ? data.data : 'Failed to load tasks', 'error');
        }
    } catch (error) {
        showToast('Failed to load tasks', 'error');
    } finally {
        showLoading(false);
    }
}

function renderTasks(filteredTasks = tasks) {
    const taskList = document.getElementById('taskList');
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No tasks found</h3>
                <p>Start by adding a new task!</p>
            </div>
        `;
        return;
    }

    taskList.innerHTML = filteredTasks.map(task => `
        <div class="task-item" data-status="${task.status}">
            <div class="task-header">
                <div>
                    <h3 class="task-title">${task.title}</h3>
                    <p class="task-description">${task.description}</p>
                </div>
                <div class="task-actions">
                    <button class="task-btn edit" onclick="openEditTaskModal('${task._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-btn delete" onclick="deleteTask('${task._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="task-meta">
                <span class="task-status ${task.status}">${formatStatus(task.status)}</span>
                <span class="task-priority ${task.priority}">${task.priority}</span>
                ${task.dueDate ? `<span class="task-due-date"><i class="fas fa-calendar"></i> ${formatDate(task.dueDate)}</span>` : ''}
            </div>
        </div>
    `).join('');
}

function filterTasks(filter) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

    // Filter tasks
    let filteredTasks = tasks;
    
    if (filter !== 'all') {
        filteredTasks = tasks.filter(task => task.status === filter);
    }

    renderTasks(filteredTasks);
}

function updateTaskStats() {
    const pendingCount = tasks.filter(task => task.status === 'pending').length;
    const progressCount = tasks.filter(task => task.status === 'in-progress').length;
    const completedCount = tasks.filter(task => task.status === 'completed').length;

    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('progressCount').textContent = progressCount;
    document.getElementById('completedCount').textContent = completedCount;
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    showLoading(true);

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/tasks/api/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast('Task deleted successfully!', 'success');
            loadTasks();
        } else {
            showToast(typeof data.data === 'string' ? data.data : 'Failed to delete task', 'error');
        }
    } catch (error) {
        showToast('Failed to delete task', 'error');
    } finally {
        showLoading(false);
    }
}

// Utility Functions
function showLoading(show) {
    loadingOverlay.classList.toggle('active', show);
}

function showToast(message, type = 'info') {
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    
    // Update icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toastIcon.className = icons[type] || icons.info;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function formatStatus(status) {
    return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Token Refresh Function
async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    
    try {
        const response = await fetch('http://localhost:5000/user/api/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.data.token);
            return data.data.token;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
        logout();
    }
    
    return null;
}

// API Helper with Auto-Refresh
async function makeApiCall(url, options) {
    let token = localStorage.getItem('token');
    
    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (response.status === 401) {
        // Token expired, try to refresh
        const newToken = await refreshToken();
        if (newToken) {
            response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${newToken}`
                }
            });
        }
    }
    
    return response;
}
