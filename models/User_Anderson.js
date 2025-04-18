const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); // bcrypt for password hashing and comparison

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true, // Ensure username is not empty
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true, // Ensure password is not empty
            },
        },
    }, {
        // Optional: Adding timestamps (Sequelize can handle these automatically)
        timestamps: true,
    });

    // Instance method to validate password using bcrypt
    User.prototype.validatePassword = async function (password) {
        return bcrypt.compare(password, this.password); // Compare stored hash with input password
    };

    return User;
};
