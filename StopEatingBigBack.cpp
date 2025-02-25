#include <iostream>
#include <string>

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

int main() {
    int dailyGoal = 2000; // Daily calorie goal (could be adjusted)
    int totalCalories = 0;
    string food;
    int calories;

    cout << "Welcome to the Calorie Tracker!" << endl;
    cout << "Your daily calorie goal is: " << dailyGoal << " calories." << endl;

    while (true) {
        cout << "\nEnter the food you ate (or type 'done' to finish): ";
        getline(cin, food);

        if (food == "done") {
            break;
        }

        cout << "Enter the calorie amount for " << food << ": ";
        cin >> calories;
        cin.ignore(); // To ignore the newline character left by cin

        totalCalories += calories;
        
        cout << "\nYou have consumed " << totalCalories << " calories so far." << endl;

        int remaining = remainingCalories(totalCalories, dailyGoal);
        if (remaining > 0) {
            cout << "You can still eat " << remaining << " calories today." << endl;
        } else {
            cout << "You've reached your daily calorie goal." << endl;
        }

        suggestFoodGroups(remaining);

    }

    cout << "\nThank you for using the Calorie Tracker!" << endl;

    return 0;
}