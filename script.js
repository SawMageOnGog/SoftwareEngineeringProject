let entries = [];
let totalCalories = 0;
const dailyCalorieGoal = 2000;

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('loginModal');
    const createUserModal = document.getElementById('createUserModal');
    const loginBtn = document.getElementById('loginBtn');
    const createAccountBtn = document.getElementById('createAccountBtn');
    const backToLoginBtn = document.getElementById('backToLoginBtn');
    const createUserBtn = document.getElementById('createUserBtn');

    // Check if the user is already logged in
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        modal.style.display = 'none';
        initApp(); // Initialize app if logged in
    } else {
        modal.style.display = 'flex'; // Show login modal
    }

    // Show the create new user modal when "Create New Account" is clicked
    createAccountBtn.addEventListener('click', () => {
        modal.style.display = 'none';  // Hide login modal
        createUserModal.style.display = 'flex';  // Show create user modal
    });

    // Show the login modal when "Back to Login" is clicked
    backToLoginBtn.addEventListener('click', () => {
        createUserModal.style.display = 'none';  // Hide create user modal
        modal.style.display = 'flex';  // Show login modal
    });

    // Handle login
    loginBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (username && password) {
            authenticateUser(username, password);
        } else {
            alert('Please enter both username and password.');
        }
    });

    // Handle creating a new user
    createUserBtn.addEventListener('click', () => {
        const newUsername = document.getElementById('newUsername').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();

        if (newUsername && newPassword) {
            createNewUser(newUsername, newPassword);
        } else {
            alert('Please enter a username and password.');
        }
    });
});

function initApp() {
    const username = localStorage.getItem('username');
    if (username) {
        checkForNewDay(); // Check if it's a new day and reset if necessary
        loadData();       // Load the user's data
        updateClock();     // Initialize the clock
        setInterval(updateClock, 1000);

        document.getElementById('header').textContent = `Logged in as: ${username}`;
        document.getElementById('logoutBtn').style.display = 'inline-block';
    }
}

function saveData() {
    const username = localStorage.getItem('username');
    if (!username) return;  // Ensure the user is logged in before saving data

    // Save entries and total calories for the logged-in user
    localStorage.setItem(`${username}-entries`, JSON.stringify(entries));
    localStorage.setItem(`${username}-totalCalories`, totalCalories.toString());
}

function loadData() {
    const username = localStorage.getItem('username');
    if (!username) return;

    // Load the entries and total calories for the logged-in user
    const savedEntries = localStorage.getItem(`${username}-entries`);
    const savedTotalCalories = localStorage.getItem(`${username}-totalCalories`);

    if (savedEntries) {
        entries = JSON.parse(savedEntries);
        totalCalories = parseInt(savedTotalCalories);
    }

    // Display the loaded entries and update the totals
    displayEntries();
    updateTotalCalories();
    updateCaloriesLeft();
    updateFeedback();
    suggestFoodGroup();
    giveTimeBasedAdvice();
}

function authenticateUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find the user in the stored users
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        // If the user is found and the password matches, set the logged-in user
        localStorage.setItem('username', username); // Store the username in localStorage

        // Hide the login modal and show the app content
        document.getElementById('loginModal').style.display = 'none'; // Hide the login modal
        initApp();  // Initialize your app (could be your calorie tracker logic)
        
        // Load the user-specific data
        loadData();  // This ensures the correct data is loaded for the logged-in user

    } else {
        alert('Invalid username or password. Please try again.');
    }
}

function createNewUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if the user already exists
    if (users.some(user => user.username === username)) {
        alert('Username already exists!');
        return;
    }

    // Create the new user and add to the list
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('User created successfully! Please log in.');
    createUserModal.style.display = 'none'; // Close create user modal
    modal.style.display = 'flex';  // Show login modal
}

function checkForNewDay() {
    const lastResetDate = localStorage.getItem('lastResetDate');
    const currentDate = new Date().toISOString().split('T')[0];
    if (lastResetDate !== currentDate) {
        localStorage.setItem('lastResetDate', currentDate);
        resetTracker();
    }
}

function resetTracker() {
    entries = [];
    totalCalories = 0;
    saveData();
    displayEntries();
    updateTotals();
}

function addEntry() {
    const foodInput = document.getElementById('food');
    const caloriesInput = document.getElementById('calories');
    const foodTypeSelect = document.getElementById('food-type');  // Get the selected food type
    const entriesList = document.getElementById('entries');

    const food = foodInput.value.trim();
    const calories = parseInt(caloriesInput.value.trim());
    const foodType = foodTypeSelect.value;  // Get the selected food type

    if (!food || isNaN(calories)) return;

    const entry = { food, calories, foodType, timestamp: Date.now() };  // Include foodType in entry
    const entryItem = document.createElement('li');
    entryItem.textContent = `${food}: ${calories} calories (${foodType})`;  // Display food type in entry

    // Create Remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.classList.add('remove-btn');
    removeBtn.onclick = function () {
        if (confirm('Are you sure?')) {
            entriesList.removeChild(entryItem);
            removeEntryFromStorage(entry.timestamp);
            updateTotals();
        }
    };

    entryItem.appendChild(removeBtn);
    entriesList.appendChild(entryItem);

    entries.push(entry);  // Add entry to the list
    totalCalories += calories;  // Update total calories

    saveData();  // Immediately save the data after adding a new entry
    updateTotals();  // Update the totals on screen

    foodInput.value = '';  // Clear input fields
    caloriesInput.value = '';
}

function displayEntries() {
    const entriesList = document.getElementById('entries');
    entriesList.innerHTML = '';

    entries.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.food}: ${entry.calories} calories (${entry.foodType})`;
        li.setAttribute('data-food-type', entry.foodType);

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

function updateTotals() {
    updateTotalCalories();
    updateCaloriesLeft();
    updateFeedback();
    suggestFoodGroup();
    giveTimeBasedAdvice();
}

function updateTotalCalories() {
    document.getElementById('totalCalories').textContent = totalCalories;
}

function updateCaloriesLeft() {
    const left = dailyCalorieGoal - totalCalories;
    document.getElementById('caloriesLeft').textContent = left >= 0 ? left : 0;
}

function updateFeedback() {
    const feedback = document.getElementById('feedback');
    if (totalCalories >= dailyCalorieGoal) {
        feedback.textContent = "STOP EATING BIG BACK! You’ve reached your calorie goal!";
    } else if (totalCalories > dailyCalorieGoal * 0.8) {
        feedback.textContent = "You’re almost there! Keep going!";
    } else if (totalCalories > dailyCalorieGoal * 0.5) {
        feedback.textContent = "You’ve had a decent amount, pace yourself.";
    } else {
        feedback.textContent = "Keep it up, you're doing great!";
    }
}

function suggestFoodGroup() {
    const suggestion = document.getElementById('suggestedFoodGroup');
    if (totalCalories < dailyCalorieGoal * 0.3) {
        suggestion.textContent = "Try adding more fruits and vegetables.";
    } else if (totalCalories < dailyCalorieGoal * 0.6) {
        suggestion.textContent = "Consider proteins or healthy fats.";
    } else if (totalCalories < dailyCalorieGoal * 0.8) {
        suggestion.textContent = "Include some whole grains.";
    } else if (totalCalories < dailyCalorieGoal * 0.9) {
        suggestion.textContent = "You're close to your goal. Drink water and avoid excess sugars.";
    } else {
        suggestion.textContent = "";
    }
}

function giveTimeBasedAdvice() {
    const advice = document.getElementById('timeBasedAdvice');
    const currentHour = new Date().getHours();
    const left = dailyCalorieGoal - totalCalories;

    if (currentHour < 12) {
        advice.textContent = left > 1600 ? "Good morning! You've got plenty of time and calories left." :
                             left > 1000 ? "It’s early! You can eat more, but pace yourself." :
                             "Whoa! It’s morning and you’ve eaten a lot. Slow down.";
    } else if (currentHour < 18) {
        advice.textContent = left > 1000 ? "You’re on track, just don’t overeat at lunch." :
                             left > 500 ? "You’re doing well! Balance your meals for the rest of the day." :
                             "Almost there! Light dinner might be enough.";
    } else {
        advice.textContent = left > 800 ? "Dinner time! Make sure you eat something." :
                             left > 300 ? "Getting late. Maybe a snack, but nothing big." :
                             "It’s late and you’ve had plenty. Stop eating, big back.";
    }
}

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

function clearInputs() {
    document.getElementById('food').value = '';
    document.getElementById('calories').value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('reset-btn')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset everything? This cannot be undone.')) {
            resetTracker();
            displayEntries();
            updateTotals();
        }
    });
});

document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('username');
    location.reload();  // Force logout and reload
});

document.getElementById('createUserBtn').addEventListener('click', () => {
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();

    if (newUsername && newPassword) {
        createNewUser(newUsername, newPassword);
    } else {
        alert('Please enter a username and password.');
    }
});