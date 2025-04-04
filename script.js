let entries = [];
let totalCalories = 0;
const dailyCalorieGoal = 2000;

function addEntry() {
    const food = document.getElementById('food').value;
    const calories = document.getElementById('calories').value;

    if (food && calories) {
        const entry = { food, calories: parseInt(calories) };
        entries.push(entry);
        totalCalories += entry.calories;
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
        feedbackElement.textContent = "You’ve reached your calorie goal! Great job!";
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
    } else {
        suggestedFoodGroupElement.textContent = "You’re close to your goal. Drink water and avoid excess sugars.";
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
            timeBasedAdviceElement.textContent = "You’ve eaten a lot already. Pace yourself!";
        }
    } else if (currentTime >= 12 && currentTime < 18) { // Afternoon (12 PM - 6 PM)
        if (caloriesLeft > dailyCalorieGoal * 0.5) {
            timeBasedAdviceElement.textContent = "Good afternoon! You’re on track, but don’t eat too much too soon.";
        } else if (caloriesLeft > dailyCalorieGoal * 0.2) {
            timeBasedAdviceElement.textContent = "You’re doing well! Make sure to balance your meals for the rest of the day.";
        } else {
            timeBasedAdviceElement.textContent = "Slow down a bit. You’re getting close to your goal.";
        }
    } else { // Evening and Late Night (6 PM - 6 AM)
        if (caloriesLeft > dailyCalorieGoal * 0.5) {
            timeBasedAdviceElement.textContent = "It’s evening! Make sure to eat a proper dinner.";
        } else if (caloriesLeft > dailyCalorieGoal * 0.2) {
            timeBasedAdviceElement.textContent = "You’re doing great, but be mindful of your calories in the evening.";
        } else {
            timeBasedAdviceElement.textContent = "It’s getting late. Slow down and make sure you don’t go over your goal.";
        }
    }
}

function clearInputs() {
    document.getElementById('food').value = '';
    document.getElementById('calories').value = '';
}
