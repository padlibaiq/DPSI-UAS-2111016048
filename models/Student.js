const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, default: 'student' }
});

studentSchema.methods.validatePassword = function (plainPassword) {
    return bcrypt.compareSync(plainPassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
