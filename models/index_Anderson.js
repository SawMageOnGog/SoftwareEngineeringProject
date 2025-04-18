const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

// Initialize the Sequelize instance with SQLite configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Path to the SQLite database file
});

// Object to hold the models
const db = {};

// Dynamically load and initialize all models in this directory (excluding this file)
fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js' && file.endsWith('.js')) // Exclude 'index.js' and non-model files
  .forEach((file) => {
    // Resolve the model definition from the file
    const modelDefiner = require(path.join(__dirname, file)); // Import model definition function

    // Check if the model definition is a function before invoking it
    if (typeof modelDefiner === 'function') {
      const model = modelDefiner(sequelize, DataTypes); // Define the model with Sequelize
      db[model.name] = model; // Store the model in the db object using its name as the key
    } else {
      // Log a warning if the file doesn't export a valid model definition function
      console.warn(`⚠️ Skipping ${file} - Does not export a valid model function`);
    }
  });

// Attach the Sequelize instance and Sequelize class to the db object for global access
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the db object containing all models and sequelize instance
module.exports = db;
