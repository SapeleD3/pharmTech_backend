const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const drugSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    drugsName : {
        type: String,
        required: true,
        unique: true
    },
    categoryName: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: new Date().toISOString()
    }
})

const drugs = mongoose.model('drugs', drugSchema)
exports.Drugs = drugs;