#ifndef FOOD_ENTRY_H
#define FOOD_ENTRY_H

#include <string>
#include <vector>

// Food entry structure
struct FoodEntry {
    int id;
    std::string name;
    int calories;
    double protein;
    double fat;
    double carbs;
    std::string date_added;
};

// Functions for food entry CRUD operations
void add_food_entry(int user_id, const std::string& name, int calories, double protein, double fat, double carbs, const std::string& date_added);
void update_food_entry(int id, const std::string& name, int calories, double protein, double fat, double carbs, const std::string& date_added);
void delete_food_entry(int id);
std::vector<FoodEntry> get_food_entries(int user_id);
std::vector<FoodEntry> filter_food_entries(int user_id, const std::string& filter_by, const std::string& value);

#endif // FOOD_ENTRY_H
