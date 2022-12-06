import { postController } from "../../../helpers/api/posts_controller";
import {stdLog} from "../../../helpers/debug/log_helper";

export default async function handler(req, res) {
    if (req.method == "POST") {
        const { post_id } = req.body;
        stdLog.log("Post requested: " + post_id, "API");

        if (post_id == undefined) {
            res.status(400).json({message: "Invalid request!"});
            return;
        }

        // Return a response
        let response_data = await postController.getPostById(post_id);
        if (response_data == undefined) {
            res.status(404).json({message: "Post not found!"});
        }

        // Respond with json data
        res.status(200).json(response_data);
    } else {
        res.status(400).json({message: "Invalid request!"});
    }
}