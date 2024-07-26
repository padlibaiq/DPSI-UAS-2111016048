const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['admin', 'student', 'librarian'], required: true }
});

// Hash password before saving
userSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        this.password = bcryptjs.hashSync(this.password, 10);
    }
    next();
});

// Method to validate password
userSchema.methods.validatePassword = function(password) {
    return bcryptjs.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
