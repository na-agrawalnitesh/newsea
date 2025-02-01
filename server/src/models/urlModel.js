const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    url_id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    note: {
        type: String,
    },
    source: {
        type: String,
        required: true,
        default: "https://localhost:5000",
    },
    destination: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Url", urlSchema);