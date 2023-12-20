const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ContestDB = require("../models/contestModel");
const Ship14 = require("../models/shipModel");
const Ship7 = require("../models/shipModel7.js");
const fetch = require("node-fetch");
const { default: mongoose } = require("mongoose");
// import { Web3Storage } from 'web3.storage'
// import { Web3Storage } from "https://cdn.jsdelivr.net/npm/web3.storage/dist/bundle.esm.min.js";

// General function to Fetch data from {CC, CF, LC} Apis 
let promiseCall = (URL) => {

    return (resolve, reject) => {
        fetch(URL)
            .then((response) => {
                return response.json()
            })
            .then((jsonResponse) => {
                // console.log(URL, jsonResponse)
                resolve(jsonResponse);
            })
            .catch((error) => {
                reject(error)
            })
    }

}


const sensordata = [
    {
        "lever": 1.138,
        "speed": 3,
        "gtn": 1349.489,
        "ggn": 6677.38,
        "ts": 7.584,
        "tp": 7.584,
        "t2": 550.563,
        "p48": 1.096,
        "p2": 5.947,
        "pexh": 1.019,
        "tic": 7.137,
        "mf": 0.082,
        "output": 0.95
    },
    {
        "lever": 2.088,
        "speed": 6,
        "gtn": 1376.166,
        "ggn": 6828.469,
        "ts": 28.204,
        "tp": 28.204,
        "t2": 581.658,
        "p48": 1.331,
        "p2": 7.282,
        "pexh": 1.019,
        "tic": 10.655,
        "mf": 0.287,
        "output": 0.95
    },
    {
        "lever": 3.144,
        "speed": 9,
        "gtn": 1386.757,
        "ggn": 7111.811,
        "ts": 60.358,
        "tp": 60.358,
        "t2": 587.587,
        "p48": 1.389,
        "p2": 7.574,
        "pexh": 1.02,
        "tic": 13.086,
        "mf": 0.259,
        "output": 0.95
    },
    {
        "lever": 4.161,
        "speed": 12,
        "gtn": 1547.465,
        "ggn": 7792.63,
        "ts": 113.774,
        "tp": 113.774,
        "t2": 613.851,
        "p48": 1.658,
        "p2": 9.007,
        "pexh": 1.022,
        "tic": 18.109,
        "mf": 0.358,
        "output": 0.95
    },
    {
        "lever": 5.14,
        "speed": 15,
        "gtn": 1924.313,
        "ggn": 8494.777,
        "ts": 175.306,
        "tp": 175.306,
        "t2": 645.642,
        "p48": 2.078,
        "p2": 11.197,
        "pexh": 1.026,
        "tic": 26.373,
        "mf": 0.522,
        "output": 0.95
    },
    {
        "lever": 6.175,
        "speed": 18,
        "gtn": 2307.404,
        "ggn": 8828.36,
        "ts": 246.278,
        "tp": 246.278,
        "t2": 676.397,
        "p48": 2.501,
        "p2": 13.356,
        "pexh": 1.03,
        "tic": 35.76,
        "mf": 0.708,
        "output": 0.95
    },
    {
        "lever": 7.148,
        "speed": 21,
        "gtn": 2678.086,
        "ggn": 9132.429,
        "ts": 332.077,
        "tp": 332.077,
        "t2": 699.954,
        "p48": 2.963,
        "p2": 15.679,
        "pexh": 1.035,
        "tic": 45.881,
        "mf": 0.908,
        "output": 0.95
    },
    {
        "lever": 8.206,
        "speed": 24,
        "gtn": 3087.561,
        "ggn": 9318.562,
        "ts": 437.989,
        "tp": 437.989,
        "t2": 741.77,
        "p48": 3.576,
        "p2": 18.632,
        "pexh": 1.04,
        "tic": 62.44,
        "mf": 1.236,
        "output": 0.95
    },
    {
        "lever": 9.3,
        "speed": 27,
        "gtn": 3560.395,
        "ggn": 9778.528,
        "ts": 644.905,
        "tp": 644.905,
        "t2": 789.094,
        "p48": 4.498,
        "p2": 22.811,
        "pexh": 1.049,
        "tic": 92.556,
        "mf": 1.832,
        "output": 0.95
    },
    {
        "lever": 1.138,
        "speed": 3,
        "gtn": 1355.375,
        "ggn": 6683.916,
        "ts": 7.915,
        "tp": 7.915,
        "t2": 550.985,
        "p48": 1.1,
        "p2": 5.963,
        "pexh": 1.019,
        "tic": 3.879,
        "mf": 0.079,
        "output": 0.95
    },
    {
        "lever": 2.088,
        "speed": 6,
        "gtn": 1371.94,
        "ggn": 6828.438,
        "ts": 27.424,
        "tp": 27.424,
        "t2": 581.44,
        "p48": 1.33,
        "p2": 7.272,
        "pexh": 1.019,
        "tic": 12.785,
        "mf": 0.289,
        "output": 0.95
    },
    {
        "lever": 3.144,
        "speed": 9,
        "gtn": 1386.758,
        "ggn": 7114.396,
        "ts": 60.353,
        "tp": 60.353,
        "t2": 587.437,
        "p48": 1.389,
        "p2": 7.567,
        "pexh": 1.02,
        "tic": 13.052,
        "mf": 0.258,
        "output": 0.95
    },
    {
        "lever": 4.161,
        "speed": 12,
        "gtn": 1547.466,
        "ggn": 7794.646,
        "ts": 113.795,
        "tp": 113.795,
        "t2": 613.688,
        "p48": 1.657,
        "p2": 8.998,
        "pexh": 1.022,
        "tic": 18.066,
        "mf": 0.358,
        "output": 0.95
    },
    {
        "lever": 5.14,
        "speed": 15,
        "gtn": 1924.313,
        "ggn": 8495.697,
        "ts": 175.314,
        "tp": 175.314,
        "t2": 645.457,
        "p48": 2.078,
        "p2": 11.185,
        "pexh": 1.026,
        "tic": 26.316,
        "mf": 0.521,
        "output": 0.95
    },
    {
        "lever": 6.175,
        "speed": 18,
        "gtn": 2307.388,
        "ggn": 8829.394,
        "ts": 246.295,
        "tp": 246.295,
        "t2": 676.17,
        "p48": 2.501,
        "p2": 13.342,
        "pexh": 1.03,
        "tic": 35.687,
        "mf": 0.707,
        "output": 0.95
    },
    {
        "lever": 7.148,
        "speed": 21,
        "gtn": 2678.086,
        "ggn": 9132.932,
        "ts": 332.208,
        "tp": 332.208,
        "t2": 699.779,
        "p48": 2.963,
        "p2": 15.661,
        "pexh": 1.035,
        "tic": 45.799,
        "mf": 0.907,
        "output": 0.95
    },
    {
        "lever": 8.206,
        "speed": 24,
        "gtn": 3087.583,
        "ggn": 9318.935,
        "ts": 438.098,
        "tp": 438.098,
        "t2": 741.605,
        "p48": 3.575,
        "p2": 18.611,
        "pexh": 1.04,
        "tic": 62.342,
        "mf": 1.234,
        "output": 0.95
    },
    {
        "lever": 9.3,
        "speed": 27,
        "gtn": 3560.401,
        "ggn": 9779.311,
        "ts": 644.963,
        "tp": 644.963,
        "t2": 788.949,
        "p48": 4.496,
        "p2": 22.784,
        "pexh": 1.049,
        "tic": 92.448,
        "mf": 1.83,
        "output": 0.95
    },
    {
        "lever": 1.138,
        "speed": 3,
        "gtn": 1371.886,
        "ggn": 6697.838,
        "ts": 8.858,
        "tp": 8.858,
        "t2": 553.143,
        "p48": 1.117,
        "p2": 6.047,
        "pexh": 1.019,
        "tic": 0,
        "mf": 0.088,
        "output": 0.95
    },
    {
        "lever": 2.088,
        "speed": 6,
        "gtn": 1371.057,
        "ggn": 6830.364,
        "ts": 27.259,
        "tp": 27.259,
        "t2": 581.244,
        "p48": 1.33,
        "p2": 7.262,
        "pexh": 1.019,
        "tic": 13.192,
        "mf": 0.289,
        "output": 0.95
    },
    {
        "lever": 3.144,
        "speed": 9,
        "gtn": 1386.759,
        "ggn": 7116.987,
        "ts": 60.356,
        "tp": 60.356,
        "t2": 587.286,
        "p48": 1.389,
        "p2": 7.559,
        "pexh": 1.02,
        "tic": 13.018,
        "mf": 0.258,
        "output": 0.95
    },
    {
        "lever": 4.161,
        "speed": 12,
        "gtn": 1547.466,
        "ggn": 7796.657,
        "ts": 113.801,
        "tp": 113.801,
        "t2": 613.524,
        "p48": 1.657,
        "p2": 8.989,
        "pexh": 1.022,
        "tic": 18.023,
        "mf": 0.357,
        "output": 0.95
    },
    {
        "lever": 5.14,
        "speed": 15,
        "gtn": 1924.315,
        "ggn": 8496.61,
        "ts": 175.282,
        "tp": 175.282,
        "t2": 645.272,
        "p48": 2.078,
        "p2": 11.174,
        "pexh": 1.026,
        "tic": 26.26,
        "mf": 0.52,
        "output": 0.95
    },
    {
        "lever": 6.175,
        "speed": 18,
        "gtn": 2307.377,
        "ggn": 8830.433,
        "ts": 246.22,
        "tp": 246.22,
        "t2": 675.943,
        "p48": 2.501,
        "p2": 13.328,
        "pexh": 1.03,
        "tic": 35.613,
        "mf": 0.705,
        "output": 0.95
    },
    {
        "lever": 7.148,
        "speed": 21,
        "gtn": 2678.086,
        "ggn": 9133.432,
        "ts": 332.108,
        "tp": 332.108,
        "t2": 699.604,
        "p48": 2.962,
        "p2": 15.644,
        "pexh": 1.035,
        "tic": 45.717,
        "mf": 0.905,
        "output": 0.95
    },
    {
        "lever": 8.206,
        "speed": 24,
        "gtn": 3087.601,
        "ggn": 9319.306,
        "ts": 438.134,
        "tp": 438.134,
        "t2": 741.441,
        "p48": 3.574,
        "p2": 18.589,
        "pexh": 1.041,
        "tic": 62.245,
        "mf": 1.232,
        "output": 0.95
    },
    {
        "lever": 9.3,
        "speed": 27,
        "gtn": 3560.403,
        "ggn": 9780.103,
        "ts": 645.076,
        "tp": 645.076,
        "t2": 788.806,
        "p48": 4.495,
        "p2": 22.756,
        "pexh": 1.049,
        "tic": 92.342,
        "mf": 1.828,
        "output": 0.95
    },
    {
        "lever": 1.138,
        "speed": 3,
        "gtn": 1391.603,
        "ggn": 6714.114,
        "ts": 10.018,
        "tp": 10.018,
        "t2": 556.617,
        "p48": 1.142,
        "p2": 6.185,
        "pexh": 1.019,
        "tic": 0,
        "mf": 0.107,
        "output": 0.95
    },
    {
        "lever": 2.088,
        "speed": 6,
        "gtn": 1366.843,
        "ggn": 6830.317,
        "ts": 26.481,
        "tp": 26.481,
        "t2": 580.761,
        "p48": 1.326,
        "p2": 7.239,
        "pexh": 1.019,
        "tic": 15.319,
        "mf": 0.289,
        "output": 0.95
    },
    {
        "lever": 3.144,
        "speed": 9,
        "gtn": 1386.759,
        "ggn": 7119.575,
        "ts": 60.351,
        "tp": 60.351,
        "t2": 587.136,
        "p48": 1.389,
        "p2": 7.552,
        "pexh": 1.02,
        "tic": 12.983,
        "mf": 0.257,
        "output": 0.95
    },
    {
        "lever": 4.161,
        "speed": 12,
        "gtn": 1547.467,
        "ggn": 7798.673,
        "ts": 113.797,
        "tp": 113.797,
        "t2": 613.361,
        "p48": 1.657,
        "p2": 8.98,
        "pexh": 1.022,
        "tic": 17.98,
        "mf": 0.356,
        "output": 0.95
    }
]


const data7 = [
    {
        "id": 5394,
        "type": 1,
        "airtemp": 30.650000000000034,
        "processtemp": 40.150000000000034,
        "speed": 1262,
        "torque": 70.5,
        "tool": 234,
        "target": 1,
        "failtype": 2,
        "tempdiff": 9.5
    },
    {
        "id": 5395,
        "type": 2,
        "airtemp": 30.650000000000034,
        "processtemp": 40.25,
        "speed": 1529,
        "torque": 36.8,
        "tool": 237,
        "target": 0,
        "failtype": 1,
        "tempdiff": 9.599999999999966
    },
    {
        "id": 5396,
        "type": 2,
        "airtemp": 30.650000000000034,
        "processtemp": 40.25,
        "speed": 1523,
        "torque": 39.7,
        "tool": 239,
        "target": 0,
        "failtype": 1,
        "tempdiff": 9.599999999999966
    },
    {
        "id": 5397,
        "type": 1,
        "airtemp": 30.650000000000034,
        "processtemp": 40.150000000000034,
        "speed": 1416,
        "torque": 42.7,
        "tool": 241,
        "target": 0,
        "failtype": 1,
        "tempdiff": 9.5
    },
    {
        "id": 5398,
        "type": 2,
        "airtemp": 30.75,
        "processtemp": 40.25,
        "speed": 1923,
        "torque": 23.9,
        "tool": 244,
        "target": 0,
        "failtype": 1,
        "tempdiff": 9.5
    },
    {
        "id": 5399,
        "type": 3,
        "airtemp": 30.650000000000034,
        "processtemp": 40.25,
        "speed": 1411,
        "torque": 53.8,
        "tool": 246,
        "target": 1,
        "failtype": 4,
        "tempdiff": 9.599999999999966
    },
    {
        "id": 5400,
        "type": 2,
        "airtemp": 30.55000000000001,
        "processtemp": 40.25,
        "speed": 1477,
        "torque": 46.3,
        "tool": 251,
        "target": 1,
        "failtype": 4,
        "tempdiff": 9.699999999999989
    },
    {
        "id": 5401,
        "type": 1,
        "airtemp": 30.450000000000045,
        "processtemp": 40.150000000000034,
        "speed": 1454,
        "torque": 54.8,
        "tool": 253,
        "target": 1,
        "failtype": 3,
        "tempdiff": 9.699999999999989
    },
    {
        "id": 5402,
        "type": 2,
        "airtemp": 30.55000000000001,
        "processtemp": 40.150000000000034,
        "speed": 1421,
        "torque": 48.5,
        "tool": 0,
        "target": 0,
        "failtype": 1,
        "tempdiff": 9.600000000000023
    },
    {
        "id": 5403,
        "type": 2,
        "airtemp": 30.55000000000001,
        "processtemp": 40.150000000000034,
        "speed": 1858,
        "torque": 25.4,
        "tool": 2,
        "target": 0,
        "failtype": 1,
        "tempdiff": 9.600000000000023
    },
    {
        "id": 5404,
        "type": 3,
        "airtemp": 30.650000000000034,
        "processtemp": 40.35000000000002,
        "speed": 1422,
        "torque": 46.1,
        "tool": 4,
        "target": 0,
        "failtype": 1,
        "tempdiff": 9.699999999999989
    },
    {
        "id": 5405,
        "type": 2,
        "airtemp": 30.55000000000001,
        "processtemp": 40.25,
        "speed": 1444,
        "torque": 48.7,
        "tool": 9,
        "target": 0,
        "failtype": 1,
        "tempdiff": 9.699999999999989
    },
    {
        "id": 5406,
        "type": 2,
        "airtemp": 30.55000000000001,
        "processtemp": 40.25,
        "speed": 1360,
        "torque": 47.8,
        "tool": 11,
        "target": 0,
        "failtype": 1,
        "tempdiff": 9.699999999999989
    },
    {
        "id": 5407,
        "type": 2,
        "airtemp": 30.55000000000001,
        "processtemp": 40.25,
        "speed": 1954,
        "torque": 24.8,
        "tool": 13,
        "target": 0,
        "failtype": 1,
        "tempdiff": 9.699999999999989
    },
    {
        "id": 5408,
        "type": 2,
        "airtemp": 30.450000000000045,
        "processtemp": 40.25,
        "speed": 1628,
        "torque": 33,
        "tool": 15,
        "target": 0,
        "failtype": 1,
        "tempdiff": 9.799999999999955
    },
    {
        "id": 5409,
        "type": 2,
        "airtemp": 30.55000000000001,
        "processtemp": 40.25,
        "speed": 1433,
        "torque": 44.2,
        "tool": 17,
        "target": 0,
        "failtype": 1,
        "tempdiff": 9.699999999999989
    },
    {
        "id": 5410,
        "type": 1,
        "airtemp": 30.55000000000001,
        "processtemp": 40.35000000000002,
        "speed": 1417,
        "torque": 51.5,
        "tool": 19,
        "target": 0,
        "failtype": 1,
        "tempdiff": 9.800000000000011
    },
    {
        "id": 5411,
        "type": 2,
        "airtemp": 30.650000000000034,
        "processtemp": 40.450000000000045,
        "speed": 1462,
        "torque": 39.4,
        "tool": 22,
        "target": 0,
        "failtype": 1,
        "tempdiff": 9.800000000000011
    }
]


// copy user database content -- data loss issue
exports.cron_7 = catchAsyncErrors(async (req, res, next) => {

    console.log("cron 7 job started....");

    const idx = Math.floor(Math.random() * 12);

    const data = data7[idx];

    const updated = await Ship7.create(
        data
    );

    res.json(updated)

});


// copy user database content -- data loss issue
exports.cron_14 = catchAsyncErrors(async (req, res, next) => {

    console.log("cron job started....");

    const idx = Math.floor(Math.random() * 15);

    const data = sensordata[idx];

    const updated = await Ship14.create(
        data
    );

    res.json(updated)

});

// copy user database content -- data loss issue
exports.getall = catchAsyncErrors(async (req, res, next) => {

    const data = await Ship14.find({});
    const data7 = await Ship7.find({});

    data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    data7.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json({
        "data": data,
        "data7": data7,
    })

});

// copy user database content -- data loss issue
exports.dummy = catchAsyncErrors(async (req, res, next) => {


    let tokenInput =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGVFOTE5N0UzZjg4NDVERDZFREI0MjAwMzUyNDkwZGRiNDYwMWI2QjYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzU4Nzc5Mjk5ODgsIm5hbWUiOiJ0ZW1wIn0.3NRcLALJLP1Noh48GThYaHGkL_CMaMysCNxmQ6l-VKY";
    const token = tokenInput;

    const getFileLink = async () => {
        let client = new Web3Storage({ token });
        let files = document.getElementById("filepicker").files;
        console.log("file uploading");
        let cid = await client.put(files, {
            onRootCidReady: (localCid) => {
                console.log(`> 🔑 locally calculated Content ID: ${localCid} `);
                console.log("> 📡 sending files to web3.storage ");
            },
            onStoredChunk: (bytes) =>
                console.log(`> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`),
        });
        let link = `https://dweb.link/ipfs/${cid}`
        console.log(link);

        res.json(link)
        // return link
    }

});






















// copy user database content -- data loss issue
exports.get_all_contests = catchAsyncErrors(async (req, res, next) => {

    const data = await ContestDB.findOne({});
    const list = data.all_contests
    const updatedAt = data.updatedAt

    res.json({
        "success": true,
        "data": list,
        updatedAt
    })

});


// copy user database content -- data loss issue
exports.get_codechef_contests = catchAsyncErrors(async (req, res, next) => {

    const data = await ContestDB.findOne({});
    const list = data.codechef_contests
    const updatedAt = data.updatedAt

    res.json({
        "success": true,
        "data": list,
        updatedAt
    })

});


// copy user database content -- data loss issue
exports.get_codeforces_contests = catchAsyncErrors(async (req, res, next) => {

    const data = await ContestDB.findOne({});
    const list = data.codeforces_contests
    const updatedAt = data.updatedAt

    res.json({
        "success": true,
        "data": list,
        updatedAt
    })

});


// copy user database content -- data loss issue
exports.get_leetcode_contests = catchAsyncErrors(async (req, res, next) => {

    const data = await ContestDB.findOne({});
    const list = data.leetcode_contests
    const updatedAt = data.updatedAt

    res.json({
        "success": true,
        "data": list,
        updatedAt
    })

});


// copy user database content -- data loss issue
exports.get_geeksforgeeks_contests = catchAsyncErrors(async (req, res, next) => {

    const data = await ContestDB.findOne({});
    const list = data.geeksforgeeks_contests
    const updatedAt = data.updatedAt

    res.json({
        "success": true,
        "data": list,
        updatedAt
    })

});


// copy user database content -- data loss issue
exports.get_hackerrank_contests = catchAsyncErrors(async (req, res, next) => {

    const data = await ContestDB.findOne({});
    const list = data.hackerrank_contests
    const updatedAt = data.updatedAt

    res.json({
        "success": true,
        "data": list,
        updatedAt
    })

});


// copy user database content -- data loss issue
exports.get_hackerearth_contests = catchAsyncErrors(async (req, res, next) => {

    const data = await ContestDB.findOne({});
    const list = data.hackerrank_contests
    const updatedAt = data.updatedAt

    res.json({
        "success": true,
        "data": list,
        updatedAt
    })

});



// copy user database content -- data loss issue
exports.cron_update_contest = catchAsyncErrors(async (req, res, next) => {

    console.log("contests Updation Started....");


    let contest_cc = process.env.contest_cc;
    let contest_cf = process.env.contest_cf;
    let contest_lc = process.env.contest_lc;
    let contest_gfg = process.env.contest_gfg;
    let contest_hr = process.env.contest_hr;
    let contest_he = process.env.contest_he;

    let date = new Date()
    date = date.toISOString().split('T')[0]

    const tailURL = date + "T00%3A00%3A00"

    contest_cc += tailURL
    contest_cf += tailURL
    contest_lc += tailURL
    contest_gfg += tailURL
    contest_hr += tailURL
    contest_he += tailURL

    console.log(contest_cc);
    console.log(contest_cf);
    console.log(contest_lc);
    console.log(contest_gfg);
    console.log(contest_hr);
    console.log(contest_he);

    const p1 = new Promise(promiseCall(contest_cc));
    const p2 = new Promise(promiseCall(contest_cf));
    const p3 = new Promise(promiseCall(contest_lc));
    const p4 = new Promise(promiseCall(contest_gfg));
    const p5 = new Promise(promiseCall(contest_hr));
    const p6 = new Promise(promiseCall(contest_he));


    // const p1 = new Promise((resolve, reject) => { resolve() });
    // const p2 = new Promise((resolve, reject) => { resolve() });
    // const p3 = new Promise((resolve, reject) => { resolve() });
    // const p4 = new Promise((resolve, reject) => { resolve() });
    // const p5 = new Promise((resolve, reject) => { resolve() });
    // const p6 = new Promise((resolve, reject) => { resolve() });

    Promise.allSettled([p1, p2, p3, p4, p5, p6])
        .then(async (result) => {

            // console.log(result)

            finaldata = []
            ccdata = []
            cfdata = []
            lcdata = []
            gfgdata = []
            hrdata = []
            hedata = []



            // codechef contests
            if (
                result[0] &&
                result[0].status === "fulfilled" &&
                result[0].value &&
                result[0].value.objects &&
                result[0].value.objects[0]
            ) {
                finaldata.push(...result[0].value.objects)
                ccdata.push(...result[0].value.objects)
            }



            // codeforces contests
            if (
                result[1] &&
                result[1].status === "fulfilled" &&
                result[1].value &&
                result[1].value.objects &&
                result[1].value.objects[0]
            ) {
                finaldata.push(...result[1].value.objects)
                cfdata.push(...result[1].value.objects)
            }


            // leetcode contests
            if (
                result[2] &&
                result[2].status === "fulfilled" &&
                result[2].value &&
                result[2].value.objects &&
                result[2].value.objects[0]
            ) {
                finaldata.push(...result[2].value.objects)
                lcdata.push(...result[2].value.objects)
            }


            // gfg contests
            if (
                result[3] &&
                result[3].status === "fulfilled" &&
                result[3].value &&
                result[3].value.objects &&
                result[3].value.objects[0]
            ) {
                finaldata.push(...result[3].value.objects)
                gfgdata.push(...result[3].value.objects)
            }

            // hackerrank contests
            if (
                result[4] &&
                result[4].status === "fulfilled" &&
                result[4].value &&
                result[4].value.objects &&
                result[4].value.objects[0]
            ) {
                finaldata.push(...result[4].value.objects)
                hrdata.push(...result[4].value.objects)
            }


            // hackerearth contests
            if (
                result[5] &&
                result[5].status === "fulfilled" &&
                result[5].value &&
                result[5].value.objects &&
                result[5].value.objects[0]
            ) {
                finaldata.push(...result[5].value.objects)
                hedata.push(...result[5].value.objects)
            }




            finaldata.sort((a, b) => {
                let date1 = new Date(a.start);
                let date2 = new Date(b.start);
                return date1 - date2;
            })



            dbdata = {
                "all_contests": finaldata,
                "codechef_contests": ccdata,
                "codeforces_contests": cfdata,
                "leetcode_contests": lcdata,
                "geeksforgeeks_contests": gfgdata,
                "hackerrank_contests": hrdata,
                "hackerearth_contests": hedata,
            }


            let x = mongoose.connection.collections.contestdb
            // console.log(x)

            if (x) {
                await LeaderBoard.deleteMany({})
            }

            const updatedList = await ContestDB.create(
                {
                    ...dbdata
                }
            );


            return res.json({
                "success": true,
                "message": `Contests fetched sucessfully @${Date(Date.now()).toString()}`,
                "data": updatedList
            })

        })
        .catch((err) => {

            console.log("error: ", err);

            return res.json({
                "success": false,
                "error": err,
                "message": "error occoured while fetching contests"
            });
        })


    // return res.json({
    //     "success": false,
    //     "message": `Out of promise.all @${Date(Date.now()).toString()}`,
    // })

});


