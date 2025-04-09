let entries = [];
let totalCalories = 0;
const dailyCalorieGoal = 2000;

window.onload = function () {
    checkForNewDay();
    loadData();
    updateClock();
    setInterval(updateClock, 1000);
};

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

function loadData() {
    const savedEntries = localStorage.getItem('entries');
    const savedTotalCalories = localStorage.getItem('totalCalories');

    if (savedEntries) {
        entries = JSON.parse(savedEntries);
        totalCalories = parseInt(savedTotalCalories) || 0;
    }

    displayEntries();
    updateTotals();
}

function saveData() {
    localStorage.setItem('entries', JSON.stringify(entries));
    localStorage.setItem('totalCalories', totalCalories.toString());
}

function addEntry() {
    const food = document.getElementById('food').value.trim();
    const calories = parseInt(document.getElementById('calories').value.trim());

    if (!food || isNaN(calories)) return;

    const entry = { food, calories, timestamp: Date.now() };
    entries.push(entry);
    totalCalories += calories;
    saveData();
    displayEntries();
    updateTotals();
    clearInputs();
}

function displayEntries() {
    const entriesList = document.getElementById('entries');
    entriesList.innerHTML = '';

    entries.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.food}: ${entry.calories} calories`;

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
