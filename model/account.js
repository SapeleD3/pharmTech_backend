const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email : {
        type: String,
        required: true,
        unique: true
    },
    accountAddress: {
        type: String,
        required: true,
    },
    password: {
        type: Object,
        required: true,
    },
    date: {
        type: Date,
        default: new Date().toISOString()
    }
})

const Account = mongoose.model('Account', accountSchema)
exports.Account = Account;