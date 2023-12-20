const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const ContestDB = require("../models/contestModel");
const LeaderBoard = require("../models/ranklistModel");
const OtpModel = require("../models/otpModel");
const nodeMailer = require("nodemailer");
const fetch = require("node-fetch");
const updateRatings = require("../config/updateDB");
const { default: mongoose } = require("mongoose");



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




// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    // Fields: [name, email, password, codechef_id, codeforces_id, leetcode_id, github_id, college_name, geeksforgeeks_id] 

    let { name, email, password, codechef_id, codeforces_id, leetcode_id, github_id, college_name, geeksforgeeks_id } = req.body;

    if (!name || !email || !password || !college_name) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }


    if (!codechef_id || !leetcode_id || !codeforces_id || !github_id || !geeksforgeeks_id) {
        return next(new ErrorHander("Enter atleast one platform details", 400));
    }


    name = name.trim();
    email = email.trim();
    password = password.trim();
    codechef_id = codechef_id.trim();
    codeforces_id = codeforces_id.trim();
    leetcode_id = leetcode_id.trim();
    github_id = github_id.trim();
    college_name = college_name.trim();
    geeksforgeeks_id = geeksforgeeks_id.trim();

    // console.log(name, email, password, codechef_id, codeforces_id, leetcode_id, github_id, college_name);



    let p1 = new Promise(promiseCall(process.env.CODECHEF_API + codechef_id))
    let p2 = new Promise(promiseCall(process.env.CODEFORCES_API + codeforces_id))
    let p3 = new Promise(promiseCall(process.env.LEETCODE_API + leetcode_id))
    // let p4 = new Promise(promiseCall(process.env.GITHUB_API1 + github_id))
    let p5 = new Promise(promiseCall(process.env.GFG_API + geeksforgeeks_id))


    let p4 = new Promise((resolve, reject) => {
        resolve()
    })


    Promise.all([p1, p2, p3, p4, p5])
        .then(async () => {

            const user = await User.create({
                name,
                email,
                password,
                codechef_id,
                codeforces_id,
                leetcode_id,
                github_id,
                college_name,
                geeksforgeeks_id
            });


            res.json({
                "success": true,
                "message": `User (${user.email}) Registered Successfully!!`
            })

        })
        .catch((err) => {
            console.log("Error while registering user: ", err)
            console.log("User Details: ", name, email, password, codechef_id, codeforces_id, leetcode_id, github_id, geeksforgeeks_id, college_name);
            return next(new ErrorHander("Invalid username found, please enter valid usernames", 400));
        })



});




// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    let { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }

    email = email.trim();
    password = password.trim();

    console.log("data : ", email, password);

    const user = await User.findOne({ "email": email });

    if (user && user.password == password) {

        res.json({
            "success": true,
            "isvalid": true,
            "name": user.name,
            "password": user.password,
            "github_id": user.github_id,
            "codechef_id": user.codechef_id,
            "codeforces_id": user.codeforces_id,
            "leetcode_id": user.leetcode_id,
            "college_name": user.college_name,
            "message": `Credentials verified successfully!!`
        })

    }
    else {

        res.json({
            "success": true,
            "isvalid": false,
            "message": `Invalid Credentials`
        })

    }



});





// send OTP to email id of registered User
exports.sendOTP = catchAsyncErrors(async (req, res, next) => {

    let { email } = req.body;

    if (!email) {
        return next(new ErrorHander("Email ID not found", 400));
    }

    email = email.trim();

    console.log("email recieved for OTP: ", email);


    /* if (!emailDomainCheck(email)) {
        return next(new ErrorHander("Please enter your valid RKNEC domain email id", 400));
    } */

    const regUser = await User.findOne({ "email": email });

    if (regUser) {
        return next(new ErrorHander("User already registered!!", 400));
    }


    const sendEmail = async (userEmail) => {

        const transporter = nodeMailer.createTransport({
            // host: process.env.SMPT_HOST,
            port: process.env.SMPT_PORT,
            service: process.env.SMPT_SERVICE,
            secure: true,
            logger: true,
            debug: true,
            secureConnection: false,
            auth: {
                user: process.env.SMPT_MAIL,
                pass: process.env.SMPT_PASSWORD,
            },
            tls: {
                rejectUnAuthorized: false
            }
        });


        let user = await OtpModel.findOne({ "email": userEmail });

        if (!user) {

            const x = await OtpModel.create({
                email: userEmail
            });
        }

        user = await OtpModel.findOne({ "email": userEmail });

        user.generateOTP();

        await user.save({ validateBeforeSave: false });

        const OTP = user.emailVerificationOTP;

        const mailOptions = {
            from: process.env.SMPT_MAIL,
            to: userEmail,
            subject: 'OTP - Rcoem Coderz',
            text: `Heyy coder, your One Time Password (OTP) for email verification is ${OTP}. Thank You!!!`,
            html: `
            
            Thank you for choosing RCOEM Coderz for your coding needs! 
            <br>
            To ensure the security of your account, we require a one-time password (OTP) verification.

            <br><br>
            <b>Please find your OTP below:</b>
            <br><br>
            <b>OTP: ${OTP}</b>

            <br><br>
            
            Kindly enter <b>this OTP on the Login Page</b> to access your RCOEM Coderz account. 
            <br>
            <b>Please note that this OTP is valid for a limited time and should not be shared with anyone.</b>
            
            <br>

            <p style="color: red; font-weight:700">If you did not request this OTP or have any concerns, please contact our support team immediately. <a href="https://www.linkedin.com/in/kush-munot/">Kush</a> and  <a href="https://www.linkedin.com/in/prathamesh-rajbhoj-2bb157200/">Pratham</a></p>
            
            <br>

            Thank you for trusting RCOEM Coderz for your coding journey.
            <br><br>
            Best regards,<br/>
            The RCOEM Coderz Team
            `
        };

        await transporter.sendMail(mailOptions);

        // console.log("email sent");
    };

    await sendEmail(email);

    console.log('Email sent successfully');

    res.json({
        "success": true,
        "message": `OTP sent successfully!!`
    })

});




// verify OTP sent to email id of registered User
exports.verifyOTP = catchAsyncErrors(async (req, res, next) => {

    let { email, otp } = req.body;

    if (!email || !otp) {
        return next(new ErrorHander("Sufficient data not found", 400));
    }

    email = email.trim();
    otp = otp.trim();

    console.log("data recieved: ", email, otp);

    const user = await OtpModel.findOne({ "email": email });

    if (!user) {
        return next(new ErrorHander("No user/OTP found", 400));
    }

    console.log("user: ", user)

    let isValid = await user.verifyOTP(otp);

    // await user.save({ validateBeforeSave: false });

    console.log("isvalid: ", isValid)

    if (isValid) {
        res.json({
            "success": true,
            "isvalid": true,
            "message": `Rknec email id verified successfully `
        })
    }
    else {
        res.json({
            "success": true,
            "isvalid": false,
            "message": `Invalid/Expired OTP`
        })
    }

    res.json({
        "success": false,
        "message": `Email validation failed`
    })

});




// verify OTP sent to email id of registered User
exports.sendUpdateProfileOTP = catchAsyncErrors(async (req, res, next) => {

    let { email } = req.body;

    if (!email) {
        return next(new ErrorHander("Email not found, please try again", 400));
    }

    email = email.trim();

    console.log("email recieved for OTP: ", email);


    const regUser = await User.findOne({ "email": email });

    if (!regUser) {
        return next(new ErrorHander("This email is not registered!!", 400));
    }


    const sendEmail = async (userEmail) => {

        const transporter = nodeMailer.createTransport({
            // host: process.env.SMPT_HOST,
            port: process.env.SMPT_PORT,
            service: process.env.SMPT_SERVICE,
            secure: true,
            logger: true,
            debug: true,
            secureConnection: false,
            auth: {
                user: process.env.SMPT_MAIL,
                pass: process.env.SMPT_PASSWORD,
            },
            tls: {
                rejectUnAuthorized: false
            }
        });


        let user = await OtpModel.findOne({ "email": userEmail });

        if (!user) {

            const x = await OtpModel.create({
                email: userEmail
            });
        }

        user = await OtpModel.findOne({ "email": userEmail });

        user.generateOTP();

        await user.save({ validateBeforeSave: false });

        const OTP = user.emailVerificationOTP;

        const mailOptions = {
            from: process.env.SMPT_MAIL,
            to: userEmail,
            subject: 'OTP - Rcoem Coderz',
            text: `Heyy coder, your One Time Password (OTP) for user verification is ${OTP}. Thank You!!!`,
            html: `
            
            Thank you for choosing RCOEM Coderz for your coding needs! 
            <br>
            To ensure the security of your account, we require a one-time password (OTP) verification.

            <br><br>
            <b>Please find your OTP below:</b>
            <br><br>
            <b>OTP: ${OTP}</b>

            <br><br>
            
            Kindly enter <b>this OTP on the Edit Profile Page</b> to edit your RCOEM Coderz account details. 
            <br>
            <b>Please note that this OTP is valid for a limited time and should not be shared with anyone.</b>
            
            <br>

            <p style="color: red; font-weight:700">If you did not request this OTP or have any concerns, please contact our support team immediately. <a href="https://www.linkedin.com/in/kush-munot/">Kush</a> and  <a href="https://www.linkedin.com/in/prathamesh-rajbhoj-2bb157200/">Pratham</a></p>
            
            <br>

            Thank you for trusting RCOEM Coderz for your coding journey.
            <br><br>
            Best regards,<br/>
            The RCOEM Coderz Team
            `
        };

        await transporter.sendMail(mailOptions);

        // console.log("email sent");
    };

    await sendEmail(email);

    console.log('Email sent successfully');

    res.json({
        "success": true,
        "message": `OTP sent successfully!!`
    })

});





// get profile data for profile page
exports.verifyUpdateProfileOTP = catchAsyncErrors(async (req, res, next) => {

    let { email, otp } = req.body;

    // console.log("data recieved: ", email, otp);

    if (!email || !otp) {
        return next(new ErrorHander("Sufficient data not found", 400));
    }

    email = email.trim();
    otp = otp.trim();

    const user = await OtpModel.findOne({ "email": email });

    if (!user) {
        return next(new ErrorHander("No user/OTP found", 400));
    }

    // console.log("user: ", user)

    let isValid = await user.verifyOTP(otp);

    // await user.save({ validateBeforeSave: false });

    // console.log("isvalid: ", isValid)

    if (isValid) {


        let userdata = await User.findOne({ "email": email });

        if (!userdata) {
            return next(new ErrorHander("User not found, please register", 400));
        }

        res.json({
            "success": true,
            "isvalid": true,
            "name": userdata.name,
            "password": userdata.password,
            "github_id": userdata.github_id,
            "codechef_id": userdata.codechef_id,
            "codeforces_id": userdata.codeforces_id,
            "leetcode_id": userdata.leetcode_id,
            "geeksforgeeks_id": userdata.geeksforgeeks_id,
            "message": `User Verified successfully `
        })
    }
    else {
        res.json({
            "success": true,
            "isvalid": false,
            "message": `Invalid/Expired OTP`
        })
    }

    res.json({
        "success": false,
        "message": `User validation failed`
    })

});




// update profile data for profile page
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    let { email, password, codechef_id, codeforces_id, leetcode_id, github_id, geeksforgeeks_id } = req.body;


    console.log(email, password, codechef_id, codeforces_id, leetcode_id, github_id, geeksforgeeks_id);

    if (!email || !password || !codechef_id || !leetcode_id || !codeforces_id || !github_id || !geeksforgeeks_id) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }

    email = email.trim();
    password = password.trim();
    codechef_id = codechef_id.trim();
    codeforces_id = codeforces_id.trim();
    leetcode_id = leetcode_id.trim();
    github_id = github_id.trim();
    geeksforgeeks_id = geeksforgeeks_id.trim();


    let p1 = new Promise(promiseCall(process.env.CODECHEF_API + codechef_id))
    let p2 = new Promise(promiseCall(process.env.CODEFORCES_API + codeforces_id))
    let p3 = new Promise(promiseCall(process.env.LEETCODE_API + leetcode_id))
    // let p4 = new Promise(promiseCall(process.env.GITHUB_API1 + github_id))
    let p5 = new Promise(promiseCall(process.env.GFG_API + geeksforgeeks_id))

    let p4 = new Promise((resolve, reject) => {
        resolve()
    })


    Promise.all([p1, p2, p3, p4, p5])
        .then(async () => {

            const user = await User.findOneAndUpdate({ "email": email }, {
                email,
                password,
                codechef_id,
                codeforces_id,
                leetcode_id,
                github_id,
                geeksforgeeks_id
            });


            res.json({
                "success": true,
                "message": `User (${user.email}) details updated successfully!!`
            })

        })
        .catch((err) => {
            return next(new ErrorHander("Invalid username found, please enter valid usernames", 400));
        })

});




// forgot password - set new password
exports.reportUser = catchAsyncErrors(async (req, res, next) => {


    let { name, email, reporter, codechef, codeforces, leetcode, github } = req.body;


    // console.log(name, email, reporter, codechef, codeforces, leetcode, github);

    if (!name || !email || !reporter || !codechef || !codeforces || !leetcode || !github) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }


    name = name.trim();
    email = email.trim();
    reporter = reporter.trim();
    codechef = codechef.trim();
    codeforces = codeforces.trim();
    leetcode = leetcode.trim();
    github = github.trim();


    const data = {
        "reported_against_name": name,
        "reported_by_name": reporter,
        "reported_by_email": email,
        "is_codechef_invalid": codechef,
        "is_codeforces_invalid": codeforces,
        "is_leetcode_invalid": leetcode,
        "is_github_invalid": github
    };

    // console.log(data)


    const sendEmail = async (userEmail) => {

        const transporter = nodeMailer.createTransport({
            // host: process.env.SMPT_HOST,
            port: process.env.SMPT_PORT,
            service: process.env.SMPT_SERVICE,
            secure: true,
            logger: true,
            debug: true,
            secureConnection: false,
            auth: {
                user: process.env.SMPT_MAIL,
                pass: process.env.SMPT_PASSWORD,
            },
            tls: {
                rejectUnAuthorized: false
            }
        });

        const mailOptions = {
            from: process.env.SMPT_MAIL,
            to: userEmail,
            subject: 'Rcoem Coderz - Someone is reported',
            text: `Heyy admin, a report is registered. ${JSON.stringify(data)}`
        };

        await transporter.sendMail(mailOptions);

        console.log("email sent to admins");
    };

    await sendEmail(process.env.ADMIN_EMAIL_1);
    await sendEmail(process.env.ADMIN_EMAIL_2);

    // console.log('Email sent successfully');

    res.json({
        "success": true,
        "message": `Report registered successfully!!`
    })

});







// copy user database content -- data loss issue
exports.getUserDBcopy = catchAsyncErrors(async (req, res, next) => {

    const data = await User.find({});

    res.json({
        "success": true,
        "message": `User Database fetched succesfully @${Date(Date.now()).toString()}`,
        "total users": data.length,
        "data": data
    })

});




// copy user database content -- data loss issue
exports.cron_update_db = catchAsyncErrors(async (req, res, next) => {

    console.log("Ratings Updation Started....");


    // fetching user ids from Database
    const userdata = await User.find({}, { "password": 0, "_id": 0 });

    // console.log("UserData: ", userdata);



    let PromiseList = []

    for (let user of userdata) {




        // console.log(user)

        let name = user.name
        let email = user.email
        let cc_id = user.codechef_id
        let cf_id = user.codeforces_id
        let lc_id = user.leetcode_id
        let college_name = user.college_name
        let ghub_id = user.github_id
        let avatar_url = "https://avatars.githubusercontent.com/u/146207981?v=4"
        let gfg_id = user.geeksforgeeks_id;

        if (!gfg_id) {
            gfg_id = ""
        }




        let finalData = {
            name,
            email,
            total_score: 0,
            college_name: college_name,
            codechef_id: cc_id,
            codechef_rating: 0,
            codeforces_id: cf_id,
            codeforces_rating: 0,
            leetcode_id: lc_id,
            leetcode_rating: 0,
            github_id: ghub_id,
            avatar: avatar_url,
            geeksforgeeks_id: gfg_id,
            geeksforgeeks_rating: 0
        }


        let p = new Promise((resolve, reject) => {

            let p1 = new Promise(promiseCall(process.env.CODECHEF_API + cc_id))
            let p2 = new Promise(promiseCall(process.env.CODEFORCES_API + cf_id))
            let p3 = new Promise(promiseCall(process.env.LEETCODE_API + lc_id))
            let p4 = new Promise(promiseCall(process.env.GITHUB_API2 + ghub_id))
            let p5 = new Promise(promiseCall(process.env.GFG_API + gfg_id))

            // let p1 = new Promise((resolve, reject)=>{
            //     resolve()
            // })
            // let p2 = new Promise((resolve, reject)=>{
            //     resolve()
            // })
            // let p3 = new Promise((resolve, reject)=>{
            //     resolve()
            // })
            // let p4 = new Promise((resolve, reject) => {
            //     resolve()
            // })
            // let p5 = new Promise((resolve, reject)=>{
            //     return resolve()
            // })



            Promise.allSettled([p1, p2, p3, p4, p5])
                .then(((res) => {

                    // console.log("Response ALL ", res)
                    // console.log(name)



                    ////////////////// codechef score calculation //////////////////
                    if (
                        res[0] &&
                        res[0].status === "fulfilled" &&
                        res[0].value &&
                        res[0].value.rating_number &&
                        res[0].value.max_rank
                    ) {
                        finalData.codechef_rating = res[0].value.rating_number + res[0].value.max_rank
                        finalData.total_score += (finalData.codechef_rating * 1.5)
                        //finalData.college_name += res[0].institution
                    }





                    ////////////////// codeforces score calculation //////////////////
                    if (
                        res[1] &&
                        res[1].status === "fulfilled" &&
                        res[1].value &&
                        res[1].value[0] &&
                        res[1].value[0].rating &&
                        res[1].value[0].maxRating
                    ) {
                        finalData.codeforces_rating = res[1].value[0].rating + res[1].value[0].maxRating
                        finalData.total_score += (finalData.codeforces_rating * 1.5)
                    }




                    ////////////////// leetcode score calculation //////////////////
                    if (
                        res[2] &&
                        res[2].status === "fulfilled" &&
                        res[2].value &&
                        res[2].value.data &&
                        res[2].value.data.userContestRanking &&
                        res[2].value.data.userContestRanking.rating
                    ) {
                        finalData.leetcode_rating = parseInt(res[2].value.data.userContestRanking.rating)
                        finalData.total_score += (finalData.leetcode_rating * 1.5)
                    }




                    ////////////////// github score calculation //////////////////

                    if (
                        res[3] &&
                        res[3].status === "fulfilled" &&
                        res[3].value &&
                        res[3].value.years
                    ) {

                        let gitScore = 0

                        let contri = res[3].value.years;

                        // console.log(contri)

                        for (let i of contri) {
                            if (i.hasOwnProperty("total")) {
                                gitScore += parseInt((i["total"]) / 10);
                            }
                        }

                        // console.log(name, gitScore)

                        finalData.total_score += gitScore

                    }


                    ////////////////// gfg score calculation //////////////////

                    if (
                        res[4] &&
                        res[4].status === "fulfilled" &&
                        res[4].value &&
                        res[4].value.success &&
                        res[4].value.data
                    ) {

                        let gfgScore = 0
                        let scores = res[4].value.data;

                        // console.log("scores: ", scores)

                        gfgScore += (scores.Basic);
                        gfgScore += (scores.Easy * 2);
                        gfgScore += (scores.Medium * 4);
                        gfgScore += (scores.Hard * 8);

                        finalData.geeksforgeeks_rating = parseInt(gfgScore)

                        finalData.total_score += finalData.geeksforgeeks_rating


                        // console.log("gfg: ", res[4].value.data)

                        // {
                        //     School: 5,
                        //     Basic: 44,
                        //     Easy: 117,
                        //     Medium: 114,
                        //     Hard: 20,
                        //     userName: 'prathamrajbhoj2003',
                        //     totalProblemsSolved: 300
                        // }
                    }



                    finalData.total_score = parseInt(finalData.total_score)

                    resolve(finalData)
                }))
                .catch((error) => {
                    console.log("Error : ", error)
                    console.log("ErrorName : ", name)
                    reject(error)
                })

        })

        PromiseList.push(p);

        // if (PromiseList.length >= 2)
        //     break;

    }

    console.log("Total Users1: ", PromiseList.length)


    Promise.all(PromiseList)
        .then(async (result) => {

            // result = result[0].value

            // console.log("End Result : ", result)
            console.log("Total Users2: ", PromiseList.length)

            let Ranklist = {
                "total_score_list": [...result],
                "codechef_ranklist": [...result],
                "codeforces_ranklist": [...result],
                "leetcode_ranklist": [...result],
                "geeksforgeeks_ranklist": [...result]
            }

            Ranklist.total_score_list.sort(
                (x, y) => { return y.total_score - x.total_score }
            )

            Ranklist.codechef_ranklist.sort(
                (x, y) => { return y.codechef_rating - x.codechef_rating }
            )

            Ranklist.codeforces_ranklist.sort(
                (x, y) => { return y.codeforces_rating - x.codeforces_rating }
            )

            Ranklist.leetcode_ranklist.sort(
                (x, y) => { return y.leetcode_rating - x.leetcode_rating }
            )

            Ranklist.geeksforgeeks_ranklist.sort(
                (x, y) => { return y.geeksforgeeks_rating - x.geeksforgeeks_rating }
            )


            // console.log("Ranklist.total_score_list : ", Ranklist.total_score_list)
            // console.log("Ranklist : ", Ranklist)






            // ......UPDATE MONGODB......

            let x = mongoose.connection.collections.leaderboards
            // console.log(x)

            if (x) {
                await LeaderBoard.deleteMany({})
            }

            const updatedList = await LeaderBoard.create(
                {
                    ...Ranklist
                }
            );


            // console.log({
            //     "success": true,
            //     "message": `Leaderboard Updated Successfully!!`,
            //     "leaderboard": updatedList
            // })



            return res.json({
                "success": true,
                "message": `Database updated succesfully @${Date(Date.now()).toString()}`,
                "leaderboard": updatedList
            })






            // console.log({
            //     "success": true,
            //     "message": `Leaderboard Updated Successfully!!`,
            //     "leaderboard1": Ranklist.codechef_ranklist,
            //     "leaderboard2": Ranklist.codeforces_ranklist,
            //     "leaderboard3": Ranklist.leetcode_ranklist,
            //     "leaderboard4": Ranklist.total_score_list,
            //     "leaderboard5": Ranklist.geeksforgeeks_ranklist,
            // })


        })
        .catch((error) => {
            console.log(error)
            return res.json({
                "success": false,
                "message": error,
            })
        })
});


