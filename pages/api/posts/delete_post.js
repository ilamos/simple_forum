// Delete post by ID API endpoint

import { postController } from "../../../helpers/api/posts_controller";
import {stdLog} from "../../../helpers/debug/log_helper";
import {userController} from "../../../helpers/api/users_controller";
import {NIL as NIL_UUID} from "uuid";

export default function handler(req, res) {
    if (req.method == "POST") {
        const { post_id } = req.body;
        const auth_token = req.headers.auth;
        let author_id = NIL_UUID;

        stdLog.log("Post deletion requested: " + post_id, "API");

        let post_data = postController.getPostById(post_id);

        if (post_data == undefined) {
            res.status(404).json({message: "Post not found!"});
        }

        if (auth_token) {
            author_id = userController.verifyAndDecodeAuthToken(auth_token);
            if (author_id != undefined && author_id != NIL_UUID && author_id != null && typeof author_id == "string") {
                stdLog.log("Author ID: " + author_id, "API");
                if (post_data.author_id != author_id) {
                    res.status(401).json({message: "Unauthorized!"});
                    return;
                }
            }
        }

        if (post_data.author_id != author_id) {
            res.status(401).json({message: "Unauthorized!"});
            return;
        }

        if (author_id == NIL_UUID) {
            res.status(401).json({message: "Unauthorized!"});
            return;
        }


        // Delete post
        postController.deletePost(post_id);

        // Respond with json data
        res.status(200).json("Post deleted successfully!");
    } else {
        res.status(400).json({message: "Invalid request!"});
    }
}