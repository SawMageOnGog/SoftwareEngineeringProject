#include "sqlite3.h"
#include "openssl/sha.h"
#include "openssl/evp.h"
#include "save.hpp"
#include "validate.hpp"

#include <iostream>
#include <iomanip>
#include <string>
#include <fstream>

using namespace std;

int main()
{
    sqlite3* db;
    int exit = sqlite3_open("bigbackdatabase.db", &db);
    if (exit)
    {
        cerr << "Can't open database: " << sqlite3_errmsg(db) << endl;
        return 1;
    }

    //Food f;
    //Person p;
    Profile pf;

    int dailyGoal;
    int remainingCalories;
    int totalCalories;

    char hasProfile;
    cout << "Do you have a profile? (Y/N): \n";
    cin >> hasProfile;

    if (hasProfile == 'Y' || hasProfile == 'y')
    {
        cout << "Please sign in.\n";

        cout << "Enter username: ";
        cin >> pf.username;

        cout << "Enter password: ";
        cin >> pf.password;

        if (!validateLogin(pf, db))
        {
            cout << "Login successful! Welcome to the Calorie Tracker " << pf.username << "!\n";
        }

        else
        {
            cout << "Invalid login credentials!";
        }
    }

    else if (hasProfile == 'N' || hasProfile == 'n')
    {
        cout << "Please create a profile.\n";

        cout << "Enter username: ";
        cin >> pf.username;

        cout << "password: ";
        cin >> pf.password;

        cout << "Thank you for signing up to our Calorie Tracker!\n";
        cout << "We hope that you find our app as a useful tool!\n";

        saveProfile(pf, db);
    }

    else
    {
        cout << "Please enter 'Y' or 'N'.";
    }

    sqlite3_close(db);
    return 0;
}