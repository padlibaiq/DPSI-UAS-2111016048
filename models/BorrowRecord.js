const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
    bookId: { type: Number, required: true },
    studentId: { type: Number, required: true },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date, required: true }
});

const BorrowRecord = mongoose.model('BorrowRecord', borrowRecordSchema);
module.exports = BorrowRecord;
