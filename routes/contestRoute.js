const express = require("express");

const {
    get_all_contests,
    get_codechef_contests,
    get_codeforces_contests,
    get_leetcode_contests,
    get_geeksforgeeks_contests,
    get_hackerrank_contests,
    get_hackerearth_contests,

    cron_update_contest,
    
} = require("../controllers/contestController");


const router = express.Router();


router.get("/all", get_all_contests);
router.get("/codechef", get_codechef_contests);
router.get("/codeforces", get_codeforces_contests);
router.get("/leetcode", get_leetcode_contests);
router.get("/geeksforgeeks", get_geeksforgeeks_contests);
router.get("/hackerrank", get_hackerrank_contests);
router.get("/hackerearth", get_hackerearth_contests);

router.get("/cron_contest", cron_update_contest);


module.exports = router;