#include <iostream>
#include <string>
#include <vector>

using namespace std;

// Function to calculate remaining calories
int remainingCalories(int totalCalories, int dailyGoal) {
    return dailyGoal - totalCalories;
}

// Function to suggest food groups based on remaining calories
void suggestFoodGroups(int remainingCalories) {
    if (remainingCalories > 500) {
        cout << "You still have plenty of room to eat! Consider adding more protein and vegetables to your meals." << endl;
    }
    else if (remainingCalories > 200) {
        cout << "You have some calories left. A healthy snack, like fruits or nuts, could be a good choice." << endl;
    }
    else if (remainingCalories > 0) {
        cout << "You're almost there! A light snack or a small portion of fruits or veggies should be enough." << endl;
    }
    else {
        cout << "You've reached or exceeded your daily calorie goal! Be mindful of overeating, and try to focus on balanced meals tomorrow." << endl;
    }
}

// Function to get a valid calorie input from the user
int getCalorieInput(const string& food) {
    int calories;
    while (true) {
        cout << "Enter the calorie amount for " << food << ": ";
        cin >> calories;

        if (cin.fail() || calories < 0) {
            cin.clear();  // Clear the error flag
            cin.ignore(numeric_limits<streamsize>::max(), '\n'); // Ignore invalid input
            cout << "Invalid input. Please enter a valid non-negative number." << endl;
        } else {
            cin.ignore(); // To ignore the newline character left by cin
            return calories;
        }
    }
}

int main() {
    int dailyGoal;
    cout << "Welcome to the Calorie Tracker!" << endl;
    cout << "Enter your daily calorie goal: ";
    
    while (true) {
        cin >> dailyGoal;
        if (cin.fail() || dailyGoal <= 0) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Invalid input. Please enter a positive number for your calorie goal: ";
        } else {
            cin.ignore();
            break;
        }
    }

    int totalCalories = 0;
    vector<pair<string, int>> foodLog;
    string food;

    while (true) {
        cout << "\nEnter the food you ate (or type 'done' to finish): ";
        getline(cin, food);

        if (food == "done") {
            break;
        }

        int calories = getCalorieInput(food);
        totalCalories += calories;
        foodLog.emplace_back(food, calories);

        cout << "\nYou have consumed " << totalCalories << " calories so far." << endl;

        int remaining = remainingCalories(totalCalories, dailyGoal);
        if (remaining > 0) {
            cout << "You can still eat " << remaining << " calories today." << endl;
        } else {
            cout << "You've reached your daily calorie goal." << endl;
        }

        suggestFoodGroups(remaining);
    }

    // Display summary
    cout << "\nSummary of your day:" << endl;
    for (const auto& entry : foodLog) {
        cout << "- " << entry.first << ": " << entry.second << " calories" << endl;
    }
    cout << "Total calories consumed: " << totalCalories << " / " << dailyGoal << endl;
    cout << "Thank you for using the Calorie Tracker!" << endl;

    return 0;
}