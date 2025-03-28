#ifndef BACKUP_RESTORE_H
#define BACKUP_RESTORE_H

#include <string>

// Function declarations for backup and restore operations
void backup_database(const std::string& source_db, const std::string& backup_db);
void restore_database(const std::string& backup_db, const std::string& target_db);

#endif // BACKUP_RESTORE_H
