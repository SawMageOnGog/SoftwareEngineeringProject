#ifndef CSV_UTILS_H
#define CSV_UTILS_H

#include <string>
#include <vector>
#include "food_entry.h"

// Function declarations for CSV export and import
void export_csv(const std::vector<FoodEntry>& entries, const std::string& filename);
std::vector<FoodEntry> import_csv(const std::string& filename);

#endif // CSV_UTILS_H
