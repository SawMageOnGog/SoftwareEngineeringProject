#ifndef SAVE_HPP
#define SAVE_HPP

#include "sqlite3.h"

#include <iostream>
#include <fstream>
#include <string>

using namespace std;
/*
struct Food
{
    string foodName;
    string category;
    int calories;
};

struct Person
{
    string fullName;
    float weight;
    int height;
};
*/
struct Profile
{
    string username;
    string password;
};

void saveProfile(Profile& pf, sqlite3 *db)
{
    sqlite3_stmt* stmt;
    const char* sql = "INSERT INTO Profiles (username, password) VALUES (?, ?, ?);";
    
    int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);  // Prepare the SQL statement
    if (rc != SQLITE_OK) 
    {
        cerr << "Failed to prepare statement: " << sqlite3_errmsg(db) << endl;
        return;
    }

    // Bind values to the placeholders in the SQL query
    sqlite3_bind_text(stmt, 1, pf.username.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 3, pf.password.c_str(), -1, SQLITE_STATIC);

    rc = sqlite3_step(stmt); // Execute the statement
    if (rc != SQLITE_DONE) 
    {
        cerr << "Failed to insert data: " << sqlite3_errmsg(db) << endl;
    }

    else 
    {
        cout << "User data inserted successfully.\n";
    }

    sqlite3_finalize(stmt);
}
/*
void saveFood(const Food& f, sqlite3 *db)
{
    sqlite3_stmt* stmt;
    const char* sql = "INSERT INTO Food (foodName, categories, calories) VALUES (?, ?, ?);";
    
    int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);  // Prepare the SQL statement
    if (rc != SQLITE_OK) 
    {
        cerr << "Failed to prepare statement: " << sqlite3_errmsg(db) << endl;
        return;
    }

    // Bind values to the placeholders in the SQL query
    sqlite3_bind_text(stmt, 1, f.foodName.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, f.category.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 3, f.calories);

    rc = sqlite3_step(stmt); // Execute the statement
    if (rc != SQLITE_DONE) 
    {
        cerr << "Failed to insert data: " << sqlite3_errmsg(db) << endl;
    }

    else 
    {
        cout << "User data inserted successfully.\n";
    }

    sqlite3_finalize(stmt);
}

void savePerson(const Person& p, sqlite3 *db)
{
    sqlite3_stmt* stmt;
    const char* sql = "INSERT INTO Persons (fullName, weight, height) VALUES (?, ?, ?);";
    
    int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);  // Prepare the SQL statement
    if (rc != SQLITE_OK) 
    {
        cerr << "Failed to prepare statement: " << sqlite3_errmsg(db) << endl;
        return;
    }

    // Bind values to the placeholders in the SQL query
    sqlite3_bind_text(stmt, 1, p.fullName.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 2, p.weight);
    sqlite3_bind_int(stmt, 3, p.height);

    rc = sqlite3_step(stmt); // Execute the statement
    if (rc != SQLITE_DONE) 
    {
        cerr << "Failed to insert data: " << sqlite3_errmsg(db) << endl;
    }

    else 
    {
        cout << "User data inserted successfully.\n";
    }

    sqlite3_finalize(stmt);
}
*/
#endif