const mongoose = require("mongoose");
const validator = require("validator");

const Ship14Schema = new mongoose.Schema(
    {
        "lever": { type: String },
        "speed": { type: String },
        "gtn": { type: String },
        "ggn": { type: String },
        "ts": { type: String },
        "tp": { type: String },
        "t2": { type: String },
        "p48": { type: String },
        "p2": { type: String },
        "pexh": { type: String },
        "tic": { type: String },
        "mf": { type: String },
        "output": { type: String },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    }
);



module.exports = mongoose.model("Ship14", Ship14Schema);