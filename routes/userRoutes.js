const express = require("express");

const {
    registerUser,
    loginUser,
    sendOTP,
    verifyOTP,
    sendUpdateProfileOTP,
    verifyUpdateProfileOTP,
    updateProfile,
    reportUser,
    getUserDBcopy,
    cron_update_db
} = require("../controllers/userController");

const updateRatings = require("../config/updateDB");


const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/sendUpdateProfileOTP", sendUpdateProfileOTP);
router.post("/verifyUpdateProfileOTP", verifyUpdateProfileOTP);
router.patch("/updateProfile", updateProfile);
router.post("/report", reportUser);
router.get("/getDBcopy", getUserDBcopy);

router.get("/cron_update_db", cron_update_db);


module.exports = router;