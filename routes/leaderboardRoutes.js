const express = require("express");

const {
    get_codechef_leaderboard,
    get_codeforces_leaderboard,
    get_leetcode_leaderboard,
    get_totalScore_leaderboard,
    get_geeksforgeeks_leaderboard
} = require("../controllers/leaderboardController");


const router = express.Router();


router.get("/codechef", get_codechef_leaderboard);
router.get("/codeforces", get_codeforces_leaderboard);
router.get("/leetcode", get_leetcode_leaderboard);
router.get("/total", get_totalScore_leaderboard);
router.get("/geeksforgeeks", get_geeksforgeeks_leaderboard);


module.exports = router;