let entries = [];
let totalCalories = 0;
const dailyCalorieGoal = 2000;

// Load saved data from localStorage when the page loads
window.onload = function() {
    checkForNewDay();  // Check if it's a new day and reset if necessary
    loadData();
    updateClock();  // Update the clock immediately on page load
    setInterval(updateClock, 1000);  // Update the clock every second
};

function checkForNewDay() {
    const lastResetDate = localStorage.getItem('lastResetDate');
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    if (lastResetDate !== currentDate) {
        // It's a new day, so reset the tracker
        localStorage.setItem('lastResetDate', currentDate);  // Update the last reset date
        resetTracker();  // Reset entries and total calories
    }
}

function resetTracker() {
    // Clear entries and total calories
    entries = [];
    totalCalories = 0;

    // Save empty state to localStorage
    localStorage.setItem('entries', JSON.stringify(entries));
    localStorage.setItem('totalCalories', totalCalories.toString());
}

function loadData() {
    // Retrieve data from localStorage
    const savedEntries = localStorage.getItem('entries');
    const savedTotalCalories = localStorage.getItem('totalCalories');

    if (savedEntries) {
        entries = JSON.parse(savedEntries);
        totalCalories = parseInt(savedTotalCalories);
    }

    displayEntries();
    updateTotalCalories();
    updateCaloriesLeft();
    updateFeedback();
    suggestFoodGroup();
    giveTimeBasedAdvice();
}

function addEntry() {
    const food = document.getElementById('food').value;
    const calories = document.getElementById('calories').value;

    if (food && calories) {
        const entry = { food, calories: parseInt(calories) };
        entries.push(entry);
        totalCalories += entry.calories;

        // Save updated data to localStorage
        saveData();

        displayEntries();
        updateTotalCalories();
        updateCaloriesLeft();
        updateFeedback();
        suggestFoodGroup();
        giveTimeBasedAdvice();
        clearInputs();
    } else {
        alert('Please enter both food and calories.');
    }
}

function saveData() {
    // Save the current entries and total calories to localStorage
    localStorage.setItem('entries', JSON.stringify(entries));
    localStorage.setItem('totalCalories', totalCalories.toString());
}

function displayEntries() {
    const entriesList = document.getElementById('entries');
    entriesList.innerHTML = '';

    entries.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.food}: ${entry.calories} calories`;
        entriesList.appendChild(li);
    });
}

function updateTotalCalories() {
    document.getElementById('totalCalories').textContent = totalCalories;
}

function updateCaloriesLeft() {
    const caloriesLeft = dailyCalorieGoal - totalCalories;
    document.getElementById('caloriesLeft').textContent = caloriesLeft >= 0 ? caloriesLeft : 0;
}

function updateFeedback() {
    const feedbackElement = document.getElementById('feedback');
    if (totalCalories >= dailyCalorieGoal) {
        feedbackElement.textContent = "STOP EATING BIG BACK! You’ve reached your calorie goal and you shouldn't eat anymore today! Great job!";
    } else if (totalCalories > dailyCalorieGoal * 0.8) {
        feedbackElement.textContent = "You’re almost there! Keep going!";
    } else if (totalCalories > dailyCalorieGoal * 0.5) {
        feedbackElement.textContent = "You’ve had a decent amount, pace yourself.";
    } else {
        feedbackElement.textContent = "Keep it up, you're doing great!";
    }
}

function suggestFoodGroup() {
    const suggestedFoodGroupElement = document.getElementById('suggestedFoodGroup');
    if (totalCalories < dailyCalorieGoal * 0.3) {
        suggestedFoodGroupElement.textContent = "Try adding more fruits and vegetables.";
    } else if (totalCalories < dailyCalorieGoal * 0.6) {
        suggestedFoodGroupElement.textContent = "Consider adding some proteins or healthy fats.";
    } else if (totalCalories < dailyCalorieGoal * 0.8) {
        suggestedFoodGroupElement.textContent = "Include some whole grains to balance your intake.";
    } else if (totalCalories < dailyCalorieGoal * 0.9) {
        suggestedFoodGroupElement.textContent = "You can only eat a little more big back, you’re really close to your goal. Drink water and avoid excess sugars.";
    } else {
        suggestedFoodGroupElement.textContent = "";
    }
}

function giveTimeBasedAdvice() {
    const timeBasedAdviceElement = document.getElementById('timeBasedAdvice');
    const caloriesLeft = dailyCalorieGoal - totalCalories;
    const currentTime = new Date().getHours();

    // Time of Day-Based Feedback
    if (currentTime >= 6 && currentTime < 12) { // Morning (6 AM - 12 PM)
        if (caloriesLeft > dailyCalorieGoal * 0.8) {
            timeBasedAdviceElement.textContent = "Good morning! You’ve got plenty of time and calories left. Keep a steady pace.";
        } else if (caloriesLeft > dailyCalorieGoal * 0.5) {
            timeBasedAdviceElement.textContent = "It’s early! You can afford to eat more, but don't overdo it.";
        } else {
            timeBasedAdviceElement.textContent = "Stop eating big back! You’ve eaten a LOT today. Pace yourself!";
        }
    } else if (currentTime >= 12 && currentTime < 18) { // Afternoon (12 PM - 6 PM)
        if (caloriesLeft > dailyCalorieGoal * 0.5) {
            timeBasedAdviceElement.textContent = "Good afternoon! You’re on track, but don’t be a big back, slow down a little bit.";
        } else if (caloriesLeft > dailyCalorieGoal * 0.2) {
            timeBasedAdviceElement.textContent = "You’re doing well! Make sure to balance your meals for the rest of the day.";
        } else {
            timeBasedAdviceElement.textContent = "Stop eating big back! You’re getting close to your goal. You might finish up with a snack";
        }
    } else { // Evening and Late Night (6 PM - 6 AM)
        if (caloriesLeft > dailyCalorieGoal * 0.5) {
            timeBasedAdviceElement.textContent = "It’s evening! Make sure to eat a proper dinner.";
        } else if (caloriesLeft > dailyCalorieGoal * 0.35) {
            timeBasedAdviceElement.textContent = "You’re doing great, but be mindful of your calories in the evening.";
        } else if (caloriesLeft > dailyCalorieGoal * 0.2){
            timeBasedAdviceElement.textContent = "It’s getting late. Don't be a big back, slow down and make sure you don’t go over your goal.";
        } else {
            timeBasedAdviceElement.textContent = "You should stop eating, you might be a big back";
        }
    }
}

function updateClock() {
    // Update the current time
    const now = new Date();
    const currentTime = now.toLocaleTimeString();
    document.getElementById('time').textContent = currentTime;

    // Calculate time left until midnight
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);  // Set the time to midnight of the current day
    const timeLeft = midnight - now;  // Time left in milliseconds
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));  // Convert milliseconds to hours
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));  // Convert remaining milliseconds to minutes

    document.getElementById('timeRemaining').textContent = `${hoursLeft} hours and ${minutesLeft} minutes`;
}

function clearInputs() {
    document.getElementById('food').value = '';
    document.getElementById('calories').value = '';
}
