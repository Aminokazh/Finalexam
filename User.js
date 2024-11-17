const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    twoFactorSecret: { type: String }, // For storing the 2FA secret key
    role: { 
        type: String, 
        enum: ['admin', 'editor'], // Only 'admin' or 'editor' roles
        default: 'editor' // Default role is 'editor'
    },
}, { collection: 'new_users' });

// Pre-save hook to hash the password before saving to DB
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next(); // Proceed with saving
    } catch (err) {
        next(err); // Pass any errors to the next middleware
    }
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password); // Compare hashed password
    } catch (err) {
        throw new Error('Password comparison failed');
    }
};

// Export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
