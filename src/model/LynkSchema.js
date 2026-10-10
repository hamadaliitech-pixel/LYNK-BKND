const mongoose = require('mongoose')

const LynkSchema = mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

});

const LynkUploadModel = mongoose.model('Lynks',LynkSchema)

module.exports = LynkUploadModel;