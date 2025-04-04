#ifndef VALIDATE_HPP
#define VALIDATE_HPP

#include "sqlite3.h"
#include "openssl/evp.h"
#include "openssl/sha.h"

#include <string>
#include <iostream>
#include <iomanip>

using namespace std;

string hashPassword(const string& password)
{
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256_CTX sha256Context;
    
    SHA256_Init(&sha256Context);
    SHA256_Update(&sha256Context, password.c_str(), password.length());
    SHA256_Final(hash, &sha256Context);
    
    stringstream ss;
    for (int i = 0; i < SHA256_DIGEST_LENGTH; ++i) 
    {
        ss << hex << setw(2) << setfill('0') << (int)hash[i];
    }
    
    return ss.str();  // Return the hexadecimal hash as a string
}

int callback(void* data, int argc, char** argv, char** azColName)
{
    string* storedPasswordHash = static_cast<string*>(data);

    if (argc > 0) 
    {
        *storedPasswordHash = argv[0];
    }
    
    return 0;
}

bool validateLogin(Profile& prof, sqlite3 *db)
{
    char* errmsg = nullptr;
    int rc = sqlite3_open("bigbackdatabase.db", &db);
    if (rc)
    {
        cerr << "Can't open database: " << sqlite3_errmsg(db) << endl;
        return false;
    }

    string query = "SELECT password FROM Profiles WHERE username = '" + prof.username + "';";
    string storedPasswordHash;
    rc = sqlite3_exec(db, query.c_str(), callback, &storedPasswordHash, &errmsg);
    if (rc != SQLITE_OK)
    {
        cerr << "SQL error: " << errmsg << endl;
        sqlite3_free(errmsg);
        sqlite3_close(db);
        return false;
    }

    sqlite3_close(db);

    string hashedInputPassword = hashPassword(prof.password);
    return hashedInputPassword == storedPasswordHash;
}

#endif