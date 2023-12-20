const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const LeaderBoard = require("../models/ranklistModel");
const fetch = require("node-fetch");
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




// Updates User ratings & set leaderboard with lastest data
const updateRatings = catchAsyncErrors(async () => {

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

                        console.log("Response ALL ", res)
                        console.log(name)



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
                            res[3]
                            // res[3] &&
                            // res[3].status === "fulfilled" &&
                            // res[3].value 
                        ) {

                            let gitScore = 0

                            console.log(res[3].value)

                            // for (const key in res[3].value.total) {
                            //     if (res[3] && res[3].value.total && res[3].value.total.hasOwnProperty(key)) {
                            //         gitScore += parseInt((res[3].total[key]) / 30);
                            //     }
                            // }

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

                            console.log("scores: ", scores)

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

            if(PromiseList.length >= 2)
                break;

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

            // let x = mongoose.connection.collections.leaderboards
            // // console.log(x)

            // if (x) {
            //     await LeaderBoard.deleteMany({})
            // }

            // const updatedList = await LeaderBoard.create(
            //     {
            //         ...Ranklist
            //     }
            // );


            console.log({
                "success": true,
                "message": `Leaderboard Updated Successfully!!`,
                // "leaderboard": updatedList
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
        })


})


module.exports = updateRatings;
