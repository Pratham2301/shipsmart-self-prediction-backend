const mongoose = require("mongoose");
const validator = require("validator");

const contestSchema = new mongoose.Schema(
    {
        all_contests: [
            {
                duration: { type: String, required: [true, "Duration not found"], },
                end: { type: String, required: [true, "end not found"], },
                event: { type: String, required: [true, "event name not found"], },
                host: { type: String, required: [true, "host name not found"], },
                href: { type: String, required: [true, "href not found"],},
                id: { type: String },
                n_problems: { type: String },
                n_statistics: { type: String },
                parsed_at: { type: String },
                problems: { type: String },
                resource: { type: String },
                resource_id: { type: String },
                start: { type: String, required: [true, "start not found"], },
            },
        ],
        codechef_contests: [
            {
                duration: { type: String, required: [true, "Duration not found"], },
                end: { type: String, required: [true, "end not found"], },
                event: { type: String, required: [true, "event name not found"], },
                host: { type: String, required: [true, "host name not found"], },
                href: { type: String, required: [true, "href not found"],},
                id: { type: String },
                n_problems: { type: String },
                n_statistics: { type: String },
                parsed_at: { type: String },
                problems: { type: String },
                resource: { type: String },
                resource_id: { type: String },
                start: { type: String, required: [true, "start not found"], },
            },
        ],
        codeforces_contests: [
            {
                duration: { type: String, required: [true, "Duration not found"], },
                end: { type: String, required: [true, "end not found"], },
                event: { type: String, required: [true, "event name not found"], },
                host: { type: String, required: [true, "host name not found"], },
                href: { type: String, required: [true, "href not found"],},
                id: { type: String },
                n_problems: { type: String },
                n_statistics: { type: String },
                parsed_at: { type: String },
                problems: { type: String },
                resource: { type: String },
                resource_id: { type: String },
                start: { type: String, required: [true, "start not found"], },
            },
        ],
        leetcode_contests: [
            {
                duration: { type: String, required: [true, "Duration not found"], },
                end: { type: String, required: [true, "end not found"], },
                event: { type: String, required: [true, "event name not found"], },
                host: { type: String, required: [true, "host name not found"], },
                href: { type: String, required: [true, "href not found"],},
                id: { type: String },
                n_problems: { type: String },
                n_statistics: { type: String },
                parsed_at: { type: String },
                problems: { type: String },
                resource: { type: String },
                resource_id: { type: String },
                start: { type: String, required: [true, "start not found"], },
            },
        ],
        geeksforgeeks_contests: [
            {
                duration: { type: String, required: [true, "Duration not found"], },
                end: { type: String, required: [true, "end not found"], },
                event: { type: String, required: [true, "event name not found"], },
                host: { type: String, required: [true, "host name not found"], },
                href: { type: String, required: [true, "href not found"],},
                id: { type: String },
                n_problems: { type: String },
                n_statistics: { type: String },
                parsed_at: { type: String },
                problems: { type: String },
                resource: { type: String },
                resource_id: { type: String },
                start: { type: String, required: [true, "start not found"], },
            },
        ],
        hackerrank_contests: [
            {
                duration: { type: String, required: [true, "Duration not found"], },
                end: { type: String, required: [true, "end not found"], },
                event: { type: String, required: [true, "event name not found"], },
                host: { type: String, required: [true, "host name not found"], },
                href: { type: String, required: [true, "href not found"],},
                id: { type: String },
                n_problems: { type: String },
                n_statistics: { type: String },
                parsed_at: { type: String },
                problems: { type: String },
                resource: { type: String },
                resource_id: { type: String },
                start: { type: String, required: [true, "start not found"], },
            },
        ],
        hackerearth_contests: [
            {
                duration: { type: String, required: [true, "Duration not found"], },
                end: { type: String, required: [true, "end not found"], },
                event: { type: String, required: [true, "event name not found"], },
                host: { type: String, required: [true, "host name not found"], },
                href: { type: String, required: [true, "href not found"],},
                id: { type: String },
                n_problems: { type: String },
                n_statistics: { type: String },
                parsed_at: { type: String },
                problems: { type: String },
                resource: { type: String },
                resource_id: { type: String },
                start: { type: String, required: [true, "start not found"], },
            },
        ],
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    }
);



module.exports = mongoose.model("ContestDB", contestSchema);