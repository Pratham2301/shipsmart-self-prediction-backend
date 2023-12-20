const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const LeaderBoard = require("../models/ranklistModel");



// Get Latest Codechef Leaderboard
exports.get_codechef_leaderboard = catchAsyncErrors(async (req, res, next) => {

    const leaderboard = await LeaderBoard.findOne({}, {_id:0, __v:0});
    const codechef = leaderboard.codechef_ranklist
    const updatedAt = leaderboard.updatedAt

    res.json({
        "success" : true,
        "data": codechef,
        updatedAt 
    })

});

// Get Latest Codeforces Leaderboard
exports.get_codeforces_leaderboard = catchAsyncErrors(async (req, res, next) => {

    const leaderboard = await LeaderBoard.findOne({}, {_id:0, __v:0});
    const codeforces = leaderboard.codeforces_ranklist
    const updatedAt = leaderboard.updatedAt

    res.json({
        "success" : true,
        "data": codeforces,
        updatedAt
    })

});

// Get Latest Leetcode Leaderboard
exports.get_leetcode_leaderboard = catchAsyncErrors(async (req, res, next) => {

    const leaderboard = await LeaderBoard.findOne({}, {_id:0, __v:0});
    const leetcode = leaderboard.leetcode_ranklist
    const updatedAt = leaderboard.updatedAt

    res.json({
        "success" : true,
        "data": leetcode,
        updatedAt
    })

});

// Get Latest TotalScore Leaderboard
exports.get_totalScore_leaderboard = catchAsyncErrors(async (req, res, next) => {

    const leaderboard = await LeaderBoard.findOne({}, {_id:0, __v:0});
    const totalScore = leaderboard.total_score_list
    const updatedAt = leaderboard.updatedAt

    res.json({
        "success" : true,
        "data": totalScore,
        updatedAt
    })

});

// Get Latest GFG Leaderboard
exports.get_geeksforgeeks_leaderboard = catchAsyncErrors(async (req, res, next) => {

    const leaderboard = await LeaderBoard.findOne({}, {_id:0, __v:0});
    const totalScore = leaderboard.geeksforgeeks_ranklist
    const updatedAt = leaderboard.updatedAt

    res.json({
        "success" : true,
        "data": totalScore,
        updatedAt
    })

});
