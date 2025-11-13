// Utility functions
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || {};
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

function setCurrentUser(email) {
    localStorage.setItem('currentUser', email);
}

function getTodos() {
    const user = getCurrentUser();
    const allTodos = JSON.parse(localStorage.getItem('todos')) || {};
    return allTodos[user] || [];
}

function saveTodos(todos) {
    const user = getCurrentUser();
    const allTodos = JSON.parse(localStorage.getItem('todos')) || {};
    allTodos[user] = todos;
    localStorage.setItem('todos', JSON.stringify(allTodos));
}

function getEvents() {
    const user = getCurrentUser();
    const allEvents = JSON.parse(localStorage.getItem('events')) || {};
    return allEvents[user] || [];
}

function saveEvents(events) {
    const user = getCurrentUser();
    const allEvents = JSON.parse(localStorage.getItem('events')) || {};
    allEvents[user] = events;
    localStorage.setItem('events', JSON.stringify(allEvents));
}

function calculateStreak() {
    const todos = getTodos();
    const completedDates = todos
        .filter(todo => todo.completed)
        .map(todo => new Date(todo.id).toDateString())
        .sort();

    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (completedDates.includes(today) || completedDates.includes(yesterday)) {
        let currentDate = new Date();
        while (completedDates.includes(currentDate.toDateString())) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }
    }

    return streak;
}

// Auth functions
function login(email, password) {
    // Hardcoded credentials
    if (email === 'user@example.com' && password === 'password') {
        setCurrentUser(email);
        return true;
    }
    return false;
}

function signup(email, password) {
    // Signup disabled, use hardcoded login
    alert('Signup is disabled. Use email: user@example.com, password: password');
    return false;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Todo functions
function addTodo(text) {
    const todos = getTodos();
    const newTodo = {
        id: Date.now(),
        text,
        completed: false
    };
    todos.push(newTodo);
    saveTodos(todos);
    renderTodos();
}

function toggleTodo(id) {
    const todos = getTodos();
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos(todos);
        renderTodos();
    }
}

function deleteTodo(id) {
    const todos = getTodos();
    const filteredTodos = todos.filter(t => t.id !== id);
    saveTodos(filteredTodos);
    renderTodos();
}

function renderTodos() {
    const todos = getTodos();
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${todo.text}</span>
            <div class="todo-actions">
                <button class="complete-btn" onclick="toggleTodo(${todo.id})">✓</button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">✕</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

// Calendar functions
let currentDate = new Date();

function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const monthYear = document.getElementById('month-year');

    calendarGrid.innerHTML = '';
    monthYear.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const events = getEvents();
    const eventDates = events.map(event => event.date);

    // Only show days from the current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        dayElement.textContent = day;

        if (currentDay.toDateString() === new Date().toDateString()) {
            dayElement.classList.add('today');
        }

        if (eventDates.includes(currentDay.toISOString().split('T')[0])) {
            dayElement.classList.add('has-event');
        }

        calendarGrid.appendChild(dayElement);
    }
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// Event functions
function addEvent(text, date) {
    const events = getEvents();
    const newEvent = {
        id: Date.now(),
        text,
        date
    };
    events.push(newEvent);
    saveEvents(events);
    renderEvents();
    renderCalendar();
}

function deleteEvent(id) {
    const events = getEvents();
    const filteredEvents = events.filter(event => event.id !== id);
    saveEvents(filteredEvents);
    renderEvents();
    renderCalendar();
}

function renderEvents() {
    const events = getEvents();
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = '';
    events.forEach(event => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="event-date">${new Date(event.date).toLocaleDateString()}</div>
            <div>${event.text}</div>
            <button class="delete-btn" onclick="deleteEvent(${event.id})">✕</button>
        `;
        eventList.appendChild(li);
    });
}

function renderProfile() {
    const userEmail = document.getElementById('user-email');
    const headerStreak = document.getElementById('header-streak');
    const user = getCurrentUser();
    userEmail.textContent = user;

    const streak = calculateStreak();
    headerStreak.textContent = streak;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            if (login(email, password)) {
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password');
            }
        });
    }

    // Signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;
            if (password !== confirm) {
                alert('Passwords do not match');
                return;
            }
            if (signup(email, password)) {
                alert('Account created successfully!');
                window.location.href = 'login.html';
            } else {
                alert('Email already exists');
            }
        });
    }

    // Todo form
    const addBtn = document.getElementById('add-btn');
    const todoInput = document.getElementById('todo-input');
    if (addBtn && todoInput) {
        addBtn.addEventListener('click', function() {
            const text = todoInput.value.trim();
            if (text) {
                addTodo(text);
                todoInput.value = '';
            }
        });
        todoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addBtn.click();
            }
        });
    }

    // Event form
    const addEventBtn = document.getElementById('add-event-btn');
    const eventInput = document.getElementById('event-input');
    const eventDate = document.getElementById('event-date');
    if (addEventBtn && eventInput && eventDate) {
        addEventBtn.addEventListener('click', function() {
            const text = eventInput.value.trim();
            const date = eventDate.value;
            if (text && date) {
                addEvent(text, date);
                eventInput.value = '';
                eventDate.value = '';
            }
        });
    }

    // Calendar navigation
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', prevMonth);
        nextMonthBtn.addEventListener('click', nextMonth);
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Render components on page load
    if (document.getElementById('todo-list')) {
        renderTodos();
    }
    if (document.getElementById('calendar-grid')) {
        renderCalendar();
    }
    if (document.getElementById('event-list')) {
        renderEvents();
    }
    if (document.getElementById('profile-info')) {
        renderProfile();
    }
});
