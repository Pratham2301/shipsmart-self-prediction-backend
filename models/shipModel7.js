const mongoose = require("mongoose");
const validator = require("validator");

const Ship7Schema = new mongoose.Schema(
    {
        "id": { type: String },
        "type": { type: String },
        "airtemp": { type: String },
        "processtemp": { type: String },
        "speed": { type: String },
        "torque": { type: String },
        "tool": { type: String },
        "target": { type: String },
        "failtype": { type: String },
        "tempdiff": { type: String },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    }
);



module.exports = mongoose.model("Ship7", Ship7Schema);