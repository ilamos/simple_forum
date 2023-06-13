// noinspection JSUnusedGlobalSymbols

import { postController } from "../../../helpers/api/posts_controller";
import {stdLog} from "../../../helpers/debug/log_helper";

export default async function handler(req, res) {
    stdLog.log("All posts requested", "API");
    if (req.method === "GET") {
        // Return a response
        let response_data = await postController.getAllPosts()
        if (response_data === undefined || response_data === null) {
            stdLog.logError("No posts found!", "API");
            res.status(404).json({message: "Posts not found!"});
        }

        // Respond with json data
        res.status(200).json(response_data);
    } else {
        res.status(400).json({message: "Invalid request!"});
    }
}