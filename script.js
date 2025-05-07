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
/*
    // Check if a token exists and initialize the app if logged in
    const token = getCookie("authToken");
    if (token) {
        modal.style.display = 'none';
        initApp();
    } else {
        modal.style.display = 'flex';
    }*/
});

// Initialize the app after login
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

// Helper function to save data to localStorage
// Function to save user data to localStorage
function saveData() {
    const username = localStorage.getItem('username');
    if (!username) return;  // Ensure the user is logged in before saving data

    // Save entries and total calories for the logged-in user
    localStorage.setItem(`${username}-foodEntries`, JSON.stringify(entries));  // Save food entries specific to the user
    localStorage.setItem(`${username}-totalCalories`, totalCalories.toString());  // Save total calories specific to the user
}

// Function to load user-specific data from localStorage
function loadData() {
    const username = localStorage.getItem('username');
    if (!username) return;  // If no user is logged in, skip loading

    // Load the entries and total calories for the logged-in user
    const savedEntries = localStorage.getItem(`${username}-foodEntries`);
    const savedTotalCalories = localStorage.getItem(`${username}-totalCalories`);

    if (savedEntries) {
        entries = JSON.parse(savedEntries);  // Load the entries
    }

    if (savedTotalCalories) {
        totalCalories = parseInt(savedTotalCalories);  // Load the total calories
    }

    // Display the loaded entries and update the totals
    displayEntries();
    updateTotals();
    updateCaloriesLeft();
    updateFeedback();
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

/*
// Authenticate user with the backend (via API)
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
            document.cookie = `authToken=${data.token}; path=/; secure`;
            modal.style.display = 'none';
            initApp();
            loadData();
            /*
            localStorage.setItem('username', username); // Temporary session storage

            document.getElementById('loginModal').style.display = 'none';
            initApp();  // Start your app
            loadData(); // Load any saved calorie data
            Needa*forthis/
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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),  // Send data as JSON
        });

        const data = await response.json();

        if (response.ok) {
            alert('User created successfully!');
            modal.style.display = 'flex';
            //location.reload();  // Optionally reload the page
        } else {
            alert(data.message || 'Error creating user');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error creating the user.');
    }
}
*/
// Helper function to get cookies by name
/*
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
*/
// Check if it's a new day and reset tracker if necessary
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

// Display food entries and their details
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
                totalCalories -= entry.calories;
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

// Add a new food entry
/*function addEntry() {
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
    displayEntries(); // This will now show the new entry correctly
    updateTotals();

    foodInput.value = '';
    caloriesInput.value = '';
}*/

function addEntry() {
    const dropdown = document.getElementById("foodDropdown");
    const customInput = document.getElementById("customFoodInput");
    const calorieInput = document.getElementById("calorieInput");

    let foodName = "";
    let calories = parseInt(calorieInput.value);
    let foodType = "";

    if (dropdown.value === "Custom") {
        foodName = customInput.value.trim();
    } else {
        foodName = dropdown.value;
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        foodType = selectedOption.parentElement.label;  // Gets optgroup label as food type
    }

    if (!foodName || isNaN(calories)) {
        alert("Please enter a valid food and calorie amount.");
        return;
    }

    const entryList = document.getElementById("entries");

    const li = document.createElement("li");
    li.setAttribute("data-food-type", foodType || "Custom");
    li.innerHTML = `${foodName} - ${calories} cal`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.onclick = function () {
        entryList.removeChild(li);
        saveData();
        displayEntries();
        updateTotals();
    };

    li.appendChild(removeBtn);
    entryList.appendChild(li);

    entries.push({ food: foodName, calories, foodType, timestamp: Date.now() });

    totalCalories += calories;

    saveData();
    displayEntries();
    updateTotals();

    // Reset inputs
    dropdown.selectedIndex = 0;
    customInput.value = "";
    customInput.style.display = "none";
    calorieInput.value = "";
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

// Provide time-based advice
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

// Logout functionality
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    /*
    document.cookie = 'authToken=; Max-Age=0; path=/';  // Remove auth token cookie
    location.reload(); // Reload the page to prompt for login again*/
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

function handleFoodSelection() {
    const dropdown = document.getElementById("foodDropdown");
    const customInput = document.getElementById("customFoodInput");
    
    if (dropdown.value === "Custom") {
        customInput.style.display = "inline-block";
    } else {
        customInput.style.display = "none";
        customInput.value = ""; // Clear custom input
    }
}

function getSelectedFood() {
    const dropdown = document.getElementById("foodDropdown");
    const customInput = document.getElementById("customFoodInput");

    return dropdown.value === "Custom" ? customInput.value.trim() : dropdown.value;
}

document.getElementById("foodDropdown").addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];
    const calorieInput = document.getElementById("calorieInput");
    const customInput = document.getElementById("customFoodInput");
    const groupInput = document.getElementById("food-type");

    if (this.value === "Custom") {
        customInput.style.display = "inline-block";
        calorieInput.value = "";
        groupInput.value = "Fruits";
    } else {
        customInput.style.display = "none";
        const calories = selectedOption.getAttribute("data-calories");
        const group = selectedOption.getAttribute("data-group");
        calorieInput.value = calories || "";
        groupInput.value = group;
    }
});
