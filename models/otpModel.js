const mongoose = require("mongoose");
const validator = require("validator");

const otpModelSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Please Enter Your Email"],
            unique: true,
            validate: [validator.isEmail, "Please Enter a valid Email"],
        },
        emailVerificationOTP: {
            type: String
        },
        emailVerificationOTPExpiry: {
            type: Date
        }
    }
);



// Generating OTP
otpModelSchema.methods.generateOTP = function () {

    var digits = '0123456789';
    var OTP_len = 4

    let otp = '';
    for (let i = 0; i < OTP_len; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }

    console.log("generated otp is: ", otp)

    this.emailVerificationOTP = otp
    this.emailVerificationOTPExpiry = Date.now() + (60 * 60 * 1000);

    console.log("set otp is: ", this.emailVerificationOTP)

    return;
};


otpModelSchema.methods.verifyOTP = async function (input) {

    if (!this.emailVerificationOTPExpiry || !this.emailVerificationOTP) {
        return false;
    }

    if (Date.now() > this.emailVerificationOTPExpiry) {
        return false;
    }

    console.log("verify otp data: ", input, this.emailVerificationOTP);

    return (this.emailVerificationOTP == input);
};




module.exports = mongoose.model("OtpModel", otpModelSchema);