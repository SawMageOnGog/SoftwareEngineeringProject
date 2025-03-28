#include "user_authentication.h"
#include <iostream>
#include <bcrypt/BCrypt.hpp>

// Simulate user registration (this would typically interact with a DB)
void register_user(const std::string& username, const std::string& password) {
    std::string hashed_password = BCrypt::generateHash(password);
    std::cout << "User " << username << " registered with hashed password: " << hashed_password << std::endl;
}

bool check_password(const std::string& input_password, const std::string& stored_password_hash) {
    return BCrypt::validatePassword(input_password, stored_password_hash);
}
