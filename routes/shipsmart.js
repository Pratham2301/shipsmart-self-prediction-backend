const express = require("express");

const {

    cron_7,
    cron_14,
    getall,
    dummy
    
} = require("../controllers/contestController");


const router = express.Router();


router.get("/cron_7", cron_7);
router.get("/cron_14", cron_14);
router.get("/getall", getall);
router.get("/dummy", dummy);


module.exports = router;