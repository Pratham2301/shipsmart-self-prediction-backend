const express = require("express");

const {

    cron_14,
    
} = require("../controllers/contestController");


const router = express.Router();


router.get("/cron_14", cron_14);


module.exports = router;