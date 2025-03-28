#include <sqlite3.h>
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <chrono>

using namespace std;

// SQLite Database Initialization
void init_db(sqlite3* &db) {
    char* errMsg = 0;
    const char* sql = R"(
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        );
        CREATE TABLE IF NOT EXISTS food (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT,
            calories INTEGER,
            protein REAL,
            fat REAL,
            carbs REAL,
            date_added TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
    )";

    if (sqlite3_exec(db, sql, 0, 0, &errMsg) != SQLITE_OK) {
        std::cerr << "Error initializing database: " << errMsg << std::endl;
        sqlite3_free(errMsg);
    } else {
        std::cout << "Database initialized successfully." << std::endl;
    }
}

// Export food data to CSV
void export_csv(sqlite3* db, const std::string& filename) {
    std::ofstream file(filename);
    file << "id,name,calories,protein,fat,carbs,date_added\n";

    const char* sql = "SELECT * FROM food;";
    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        file << sqlite3_column_int(stmt, 0) << ","
             << sqlite3_column_text(stmt, 1) << ","
             << sqlite3_column_int(stmt, 2) << ","
             << sqlite3_column_double(stmt, 3) << ","
             << sqlite3_column_double(stmt, 4) << ","
             << sqlite3_column_double(stmt, 5) << ","
             << sqlite3_column_text(stmt, 6) << "\n";
    }
    sqlite3_finalize(stmt);
    file.close();
}

int main() {
    sqlite3* db;
    sqlite3_open("calorie_tracker.db", &db);
    init_db(db);

    // Simulate user registration without JSON (direct assignment)
    string username = "user1";
    string password = "password123"; // Plaintext (not recommended)

    string sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(db, sql.c_str(), -1, &stmt, nullptr);
    sqlite3_bind_text(stmt, 1, username.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, password.c_str(), -1, SQLITE_STATIC);
    sqlite3_step(stmt);
    sqlite3_finalize(stmt);

    // Simplified food entry without JSON parsing
    string food_name = "Apple";
    int calories = 95;
    double protein = 0.5;
    double fat = 0.3;
    double carbs = 25.0;
    string date_added = "2025-03-27";

    sql = "INSERT INTO food (name, calories, protein, fat, carbs, date_added) VALUES (?, ?, ?, ?, ?, ?)";
    sqlite3_prepare_v2(db, sql.c_str(), -1, &stmt, nullptr);
    sqlite3_bind_text(stmt, 1, food_name.c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 2, calories);
    sqlite3_bind_double(stmt, 3, protein);
    sqlite3_bind_double(stmt, 4, fat);
    sqlite3_bind_double(stmt, 5, carbs);
    sqlite3_bind_text(stmt, 6, date_added.c_str(), -1, SQLITE_STATIC);
    sqlite3_step(stmt);
    sqlite3_finalize(stmt);

    sqlite3_close(db);
    return 0;
}
