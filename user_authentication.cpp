// user_authentication.cpp
// C++ Code to handle user registration and login (without bcrypt)

#include "user_authentication.h"
#include <sqlite3.h>
#include <iostream>
#include <string>

// Function to register a new user
bool register_user(sqlite3* db, const std::string& username, const std::string& password) {
    // Generate API key (basic example)
    std::string api_key = "key-" + std::to_string(std::rand());

    // Insert the user into the database
    std::string sql = "INSERT INTO users (username, password, api_key) VALUES (?, ?, ?)";
    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(db, sql.c_str(), -1, &stmt, nullptr);
    sqlite3_bind_text(stmt, 1, username.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, password.c_str(), -1, SQLITE_STATIC);  // Store plain text password
    sqlite3_bind_text(stmt, 3, api_key.c_str(), -1, SQLITE_STATIC);
    
    int result = sqlite3_step(stmt);
    sqlite3_finalize(stmt);

    if (result != SQLITE_DONE) {
        std::cerr << "Error during user registration: " << sqlite3_errmsg(db) << std::endl;
        return false;
    }

    return true;
}

// Function to authenticate a user
bool authenticate_user(sqlite3* db, const std::string& username, const std::string& password) {
    std::string sql = "SELECT password FROM users WHERE username = ?";
    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(db, sql.c_str(), -1, &stmt, nullptr);
    sqlite3_bind_text(stmt, 1, username.c_str(), -1, SQLITE_STATIC);

    int result = sqlite3_step(stmt);
    if (result != SQLITE_ROW) {
        std::cerr << "User not found: " << username << std::endl;
        sqlite3_finalize(stmt);
        return false;
    }

    std::string stored_password = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0));

    sqlite3_finalize(stmt);

    // Check if the password matches (in a real system, compare hashed passwords)
    if (password == stored_password) {
        return true;
    } else {
        return false;
    }
}
