const express = require("express");

const {

    cron_14,
    getall
    
} = require("../controllers/contestController");


const router = express.Router();


router.get("/cron_14", cron_14);
router.get("/getall", getall);


module.exports = router;