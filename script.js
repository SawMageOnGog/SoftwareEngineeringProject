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
    giveTimeBasedAdvice();
}
/*
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
*/

async function authenticateUser(username, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('username', username); // Temporary session storage

            document.getElementById('loginModal').style.display = 'none';
            initApp();  // Start your app
            loadData(); // Load any saved calorie data

        } else {
            alert(data.message || 'Login failed.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('There was an error during login.');
    }
}

async function createNewUser(username, password) {
    try {
        const response = await fetch('/api/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),  // Send data as JSON
        });

        const data = await response.json();

        if (response.ok) {
            alert('User created successfully!');
            location.reload();  // Optionally reload the page
        } else {
            alert(data.message || 'Error creating user');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error creating the user.');
    }
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
    const foodTypeSelect = document.getElementById('food-type');

    const food = foodInput.value.trim();
    const calories = parseInt(caloriesInput.value.trim());
    const foodType = foodTypeSelect.value;

    if (!food || isNaN(calories)) return;

    const timestamp = Date.now(); // Generate timestamp once

    const entry = { food, calories, foodType, timestamp };
    entries.push(entry);
    totalCalories += calories;

    saveData();
    displayEntries(); // This will now show the new entry correctly
    updateTotals();

    foodInput.value = '';
    caloriesInput.value = '';
}

function displayEntries() {
    const entriesList = document.getElementById('entries');
    entriesList.innerHTML = '';

    totalCalories = 0;

    entries.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.food}: ${entry.calories} calories (${entry.foodType})`;
        li.setAttribute('data-food-type', entry.foodType);

        totalCalories += entry.calories;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn');
        removeBtn.onclick = function () {
            if (confirm('Are you sure?')) {
                entries = entries.filter(e => e.timestamp !== entry.timestamp);
                saveData();
                displayEntries();  // Re-render and recalculate
                updateTotals();
            }
        };
        

        li.appendChild(removeBtn);
        entriesList.appendChild(li);
    });

    saveData();
    updateTotals();
    updateTotalCalories();
}

function updateTotals() {
    updateTotalCalories();
    updateCaloriesLeft();
    updateFeedback();
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
    const caloriesLeft = dailyCalorieGoal - totalCalories;

    if(totalCalories >= dailyCalorieGoal) {
        const overage = totalCalories - dailyCalorieGoal;

        // Cap the max font size so it doesn't get out of hand
        const fontSize = Math.min(24 + overage * 0.05, 72); // start at 24px, grow by 0.05px per extra calorie, max at 72px

        feedback.textContent = "STOP EATING BIG BACK! You’ve reached your calorie goal!";
        feedback.style.fontSize = `${fontSize}px`;
        feedback.style.color = "red";
        feedback.style.fontWeight = "bold";
    } else {

    feedback.style.fontSize = "16px";
    feedback.style.color = "";
    feedback.style.fontWeight = "normal";

    // Incremental feedback based on total calories consumed
    if (totalCalories >= dailyCalorieGoal) {
        feedback.textContent = "STOP EATING BIG BACK! You’ve reached your calorie goal!";
    } 
    else if (totalCalories >= dailyCalorieGoal * 0.9) {
        feedback.textContent = "You're almost there! Great job staying focused. Just a little bit more!";
    } 
    else if (totalCalories > dailyCalorieGoal * 0.8) {
        feedback.textContent = "You're making excellent progress! You’ve reached 80% of your goal — pace yourself!";
    }
    else if (totalCalories > dailyCalorieGoal * 0.6) {
        feedback.textContent = "You’ve had a decent amount today! Keep going, but remember to balance your meals!";
    }
    else if (totalCalories > dailyCalorieGoal * 0.4) {
        feedback.textContent = "You're doing well! You've got a solid start. Try to stay mindful of portion sizes.";
    }
    else if (totalCalories > dailyCalorieGoal * 0.2) {
        feedback.textContent = "Nice start! You’ve had a good portion of your daily calories. Keep going strong!";
    }
    else {
        feedback.textContent = "Keep it up, you're doing great! You've just started your day — keep it balanced!";
    }
 }
    // Update both time-based and food group-based advice
    giveTimeBasedAdvice();
}

function giveTimeBasedAdvice() {
    const advice = document.getElementById('timeBasedAdvice');
    const currentHour = new Date().getHours();
    const caloriesLeft = dailyCalorieGoal - totalCalories;

    // Count food types consumed
    const typeCount = {
        fruits: 0,
        vegetables: 0,
        protein: 0,
        grains: 0,
        dairy: 0,
        sweets: 0
    };

    const estimatedCaloriesByGroup = {
        fruits: 0,
        vegetables: 0,
        protein: 0,
        grains: 0,
        dairy: 0,
        sweets: 0
    };
    
    entries.forEach(entry => {
        const type = entry.foodType?.toLowerCase();
        if (estimatedCaloriesByGroup.hasOwnProperty(type)) {
            estimatedCaloriesByGroup[type] += entry.calories || estimatedCaloriesByType[type];
        }
    });

    const groupTargets = {
        fruits: 200,
        vegetables: 250,
        protein: 400,
        grains: 500,
        dairy: 300,
        sweets: 100
    };    

    entries.forEach(entry => {
        const type = entry.foodType?.toLowerCase();
        if (typeCount.hasOwnProperty(type)) {
            typeCount[type]++;
        }
    });

    // Time-based advice
    let timeAdvice = '';
    if (currentHour < 12) {
        timeAdvice = caloriesLeft > 1600 ? 
            "Good morning! Plenty of room to plan healthy meals.\n" :
            caloriesLeft > 1000 ? 
            "It’s early — pace yourself. \n" :
            "Whoa! Heavy start — go lighter the rest of the day.\n";
    } else if (currentHour < 18) {
        timeAdvice = caloriesLeft > 1000 ? 
            "You’re on track — don’t forget balance.\n" :
            caloriesLeft > 500 ? 
            "Nice progress. Balance your next meals.\n" :
            "Almost there! Consider a light dinner.\n";
    } else {
        timeAdvice = caloriesLeft > 800 ? 
            "Dinner time — choose something nutritious.\n" :
            caloriesLeft > 300 ? 
            "Getting late — a light snack might do.\n" :
            "It’s late and you’ve eaten plenty. Wrap it up!\n";
    }

    let typeAdvice = '';

    for (const group in groupTargets) {
        const consumed = estimatedCaloriesByGroup[group];
        const target = groupTargets[group];

        if (consumed < target * 0.6) {
            typeAdvice += `You're a bit low on ${group}, try adding some.\n`;
        } else if (consumed > target * 1.2) {
            typeAdvice += `You've gone a bit heavy on ${group}, consider easing up.\n`;
        }
    }

    // Combine both time-based and food-related advice
    //advice.textContent = `${timeAdvice} ${foodAdvice} ${typeAdvice}`.trim();
    advice.innerHTML = `${timeAdvice}\n${typeAdvice}`
    .replace(/\n/g, '<br>')
    .trim();
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

document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
});

// Load dark mode from localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}