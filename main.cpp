#include "user_authentication.h"
#include "food_entry.h"
#include "database.h"
#include "analytics.h"
#include "csv_utils.h"
#include "backup_restore.h"
#include "cli_interface.h"

int main() {
    // Initialize database, set up routes, etc.

    cli_menu(); // Run the CLI or API server
    return 0;
}
