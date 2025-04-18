let entries = [];
let totalCalories = 0;
const dailyCalorieGoal = 2000;
const modal = document.getElementById('loginModal');

// DOMContentLoaded event listener to initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const createUserModal = document.getElementById('createUserModal');
    const loginBtn = document.getElementById('loginBtn');
    const createAccountBtn = document.getElementById('createAccountBtn');
    const backToLoginBtn = document.getElementById('backToLoginBtn');
    const createUserBtn = document.getElementById('createUserBtn');

    // Show the create new user modal when "Create New Account" is clicked
    createAccountBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        createUserModal.style.display = 'flex';
    });

    // Show the login modal when "Back to Login" is clicked
    backToLoginBtn.addEventListener('click', () => {
        createUserModal.style.display = 'none';
        modal.style.display = 'flex';
    });

    // Handle login logic
    loginBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        if (username && password) authenticateUser(username, password);
        else alert('Please enter both username and password.');
    });

    // Handle creating a new user
    createUserBtn.addEventListener('click', () => {
        const newUsername = document.getElementById('newUsername').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        if (newUsername && newPassword) createNewUser(newUsername, newPassword);
        else alert('Please enter a username and password.');
    });

    // Check if a token exists and initialize the app if logged in
    const token = getCookie("authToken");
    if (token) {
        modal.style.display = 'none';
        initApp();
    } else {
        modal.style.display = 'flex';
    }
});

// Initialize the app after login
function initApp() {
    const username = localStorage.getItem('username');
    if (username) {
        checkForNewDay();
        loadData();
        updateClock();
        setInterval(updateClock, 1000);
        document.getElementById('header').textContent = `Logged in as: ${username}`;
        document.getElementById('logoutBtn').style.display = 'inline-block';
    }
}

// Helper function to save data to localStorage
function saveData() {
    const username = localStorage.getItem('username');
    if (!username) return;
    localStorage.setItem(`${username}-entries`, JSON.stringify(entries));
    localStorage.setItem(`${username}-totalCalories`, totalCalories.toString());
}

// Load user-specific data from localStorage
function loadData() {
    const username = localStorage.getItem('username');
    if (!username) return;
    
    const savedEntries = localStorage.getItem(`${username}-entries`);
    const savedTotalCalories = localStorage.getItem(`${username}-totalCalories`);

    if (savedEntries) {
        entries = JSON.parse(savedEntries);
        totalCalories = parseInt(savedTotalCalories);
    }

    displayEntries();
    updateTotals();
}

// Authenticate user with the backend (via API)
async function authenticateUser(username, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            document.cookie = `authToken=${data.token}; path=/; secure`;
            modal.style.display = 'none';
            initApp();
            loadData();
        } else {
            alert(data.message || 'Login failed.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('There was an error during login.');
    }
}

// Create new user via backend API
async function createNewUser(username, password) {
    try {
        const response = await fetch('/api/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('User created successfully!');
            modal.style.display = 'flex';
        } else {
            alert(data.message || 'Error creating user');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error creating the user.');
    }
}

// Helper function to get cookies by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Check if it's a new day and reset tracker if necessary
function checkForNewDay() {
    const lastResetDate = localStorage.getItem('lastResetDate');
    const currentDate = new Date().toISOString().split('T')[0];
    if (lastResetDate !== currentDate) {
        localStorage.setItem('lastResetDate', currentDate);
        resetTracker();
    }
}

// Reset all tracker data
function resetTracker() {
    entries = [];
    totalCalories = 0;
    saveData();
    displayEntries();
    updateTotals();
}

// Display food entries and their details
function displayEntries() {
    const entriesList = document.getElementById('entries');
    entriesList.innerHTML = '';

    entries.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.food}: ${entry.calories} calories (${entry.foodType})`;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn');
        removeBtn.onclick = () => {
            if (confirm('Are you sure?')) {
                entries = entries.filter(e => e.timestamp !== entry.timestamp);
                totalCalories -= entry.calories;
                saveData();
                displayEntries();
                updateTotals();
            }
        };

        li.appendChild(removeBtn);
        entriesList.appendChild(li);
    });
}

// Add a new food entry
function addEntry() {
    const foodInput = document.getElementById('food');
    const caloriesInput = document.getElementById('calories');
    const foodTypeSelect = document.getElementById('food-type');
    
    const food = foodInput.value.trim();
    const calories = parseInt(caloriesInput.value.trim());
    const foodType = foodTypeSelect.value;

    if (!food || isNaN(calories)) return;

    const entry = { food, calories, foodType, timestamp: Date.now() };
    entries.push(entry);
    totalCalories += calories;

    saveData();
    displayEntries();
    updateTotals();

    foodInput.value = '';
    caloriesInput.value = '';
}

// Update displayed totals for calories
function updateTotals() {
    updateTotalCalories();
    updateCaloriesLeft();
    updateFeedback();
    giveTimeBasedAdvice();
}

// Update total calories
function updateTotalCalories() {
    document.getElementById('totalCalories').textContent = totalCalories;
}

// Update remaining calories
function updateCaloriesLeft() {
    const left = dailyCalorieGoal - totalCalories;
    document.getElementById('caloriesLeft').textContent = left >= 0 ? left : 0;
}

// Provide feedback based on calorie consumption
function updateFeedback() {
    const feedback = document.getElementById('feedback');
    const caloriesLeft = dailyCalorieGoal - totalCalories;

    let feedbackMessage = '';
    if (totalCalories >= dailyCalorieGoal) {
        feedbackMessage = "STOP EATING BIG BACK! You’ve reached your calorie goal!";
    } else if (totalCalories >= dailyCalorieGoal * 0.9) {
        feedbackMessage = "You're almost there! Great job staying focused.";
    } else if (totalCalories >= dailyCalorieGoal * 0.8) {
        feedbackMessage = "You're making excellent progress! Pace yourself.";
    } else if (totalCalories >= dailyCalorieGoal * 0.6) {
        feedbackMessage = "Decent progress today! Keep going and balance your meals.";
    } else if (totalCalories >= dailyCalorieGoal * 0.4) {
        feedbackMessage = "You're doing well! Keep mindful of portion sizes.";
    } else if (totalCalories >= dailyCalorieGoal * 0.2) {
        feedbackMessage = "Nice start! Keep it up!";
    } else {
        feedbackMessage = "Keep it up! You're off to a great start!";
    }

    feedback.textContent = feedbackMessage;
}

// Provide time-based advice
function giveTimeBasedAdvice() {
    const advice = document.getElementById('timeBasedAdvice');
    const currentHour = new Date().getHours();
    const caloriesLeft = dailyCalorieGoal - totalCalories;

    let timeAdvice = '';
    if (currentHour < 12) {
        timeAdvice = caloriesLeft > 1600 ? "Good morning! Plenty of room to plan healthy meals." : "It’s early — pace yourself.";
    } else if (currentHour < 18) {
        timeAdvice = caloriesLeft > 1000 ? "You're on track — don’t forget balance." : "Nice progress. Balance your next meals.";
    } else {
        timeAdvice = caloriesLeft > 800 ? "Dinner time — choose something nutritious." : "It’s late, you’ve eaten enough, wrap it up!";
    }

    advice.textContent = timeAdvice;
}

// Update the clock every second
function updateClock() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString();

    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const msLeft = midnight - now;
    const hrs = Math.floor(msLeft / 3600000);
    const mins = Math.floor((msLeft % 3600000) / 60000);
    document.getElementById('timeRemaining').textContent = `${hrs} hours and ${mins} minutes`;
}

// Clear input fields
function clearInputs() {
    document.getElementById('food').value = '';
    document.getElementById('calories').value = '';
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    document.cookie = 'authToken=; Max-Age=0; path=/';  // Remove auth token cookie
    location.reload(); // Reload the page to prompt for login again
});

// Dark mode toggle
document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
});

// Load dark mode preference from localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}
