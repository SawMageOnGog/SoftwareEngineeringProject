#ifndef ANALYTICS_H
#define ANALYTICS_H

#include <vector>
#include <string>
#include "food_entry.h"

// Function declarations for generating analytics reports
double calculate_total_calories(const std::vector<FoodEntry>& entries);
double calculate_total_protein(const std::vector<FoodEntry>& entries);
double calculate_total_fat(const std::vector<FoodEntry>& entries);
double calculate_total_carbs(const std::vector<FoodEntry>& entries);

std::string generate_daily_report(const std::vector<FoodEntry>& entries);
std::string generate_weekly_report(const std::vector<FoodEntry>& entries);

#endif // ANALYTICS_H
