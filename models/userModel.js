const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter Your Name"],
            maxLength: [30, "Name cannot exceed 30 characters"],
            minLength: [4, "Name should have more than 4 characters"],
        },
        email: {
            type: String,
            required: [true, "Please Enter Your Email"],
            unique: true,
            validate: [validator.isEmail, "Please Enter a valid Email"],
        },
        password: {
            type: String,
            required: [true, "Please Enter Your Password"],
        },
        college_name: {
            type: String,
        },
        forgotPasswordOTP: {
            type: String
        },
        forgotPasswordOTPExpiry: {
            type: Date
        },
        codechef_id: {
            type: String,
        },
        codeforces_id: {
            type: String,
        },
        leetcode_id: {
            type: String,
        },
        github_id: {
            type: String,
        },
        codechef_rating: {
            type: Number,
            default: 0
        },
        codeforces_rating: {
            type: Number,
            default: 0
        },
        leetcode_rating: {
            type: Number,
            default: 0
        },
        total_score: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        geeksforgeeks_id: {
            type: String,
        },
        geeksforgeeks_rating: {
            type: Number,
            default: 0
        },
    }
);


userSchema.methods.verifyPassword = function (input) {

    const pass = this.password
    // console.log("password validation started: ", input, pass)
    // console.log(input == this.password)
    return (input == this.password);

};



module.exports = mongoose.model("User", userSchema);