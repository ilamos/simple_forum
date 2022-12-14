import { postController } from "../../../helpers/api/posts_controller";
import {stdLog} from "../../../helpers/debug/log_helper";

export default function handler(req, res) {
    stdLog.log("All posts requested", "API");
    if (req.method == "GET") {
        // Return a response
        let response_data = postController.getAllPosts()
        if (response_data == undefined) {
            stdLog.logError("No posts found!", "API");
            res.status(404).json({message: "Posts not found!"});
        }

        // Respond with json data
        res.status(200).json(response_data);
    } else {
        res.status(400).json({message: "Invalid request!"});
    }
}