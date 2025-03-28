#ifndef DATABASE_H
#define DATABASE_H

#include <sqlite3.h>
#include <string>

// Function declarations for interacting with SQLite database
void init_db(sqlite3*& db);
void execute_query(sqlite3* db, const std::string& query);
sqlite3* open_database(const std::string& db_name);
void close_database(sqlite3* db);

#endif // DATABASE_H
