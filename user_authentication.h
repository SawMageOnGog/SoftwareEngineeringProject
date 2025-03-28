#ifndef USER_AUTHENTICATION_H
#define USER_AUTHENTICATION_H

#include <string>

bool check_password(const std::string& input_password, const std::string& stored_password_hash);
void register_user(const std::string& username, const std::string& password);

#endif // USER_AUTHENTICATION_H
