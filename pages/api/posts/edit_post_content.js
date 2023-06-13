// noinspection JSUnusedGlobalSymbols

import { postController } from "../../../helpers/api/posts_controller";
import {stdLog} from "../../../helpers/debug/log_helper";
import {userController} from "../../../helpers/api/users_controller";
import {NIL as NIL_UUID} from "uuid";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { post_id, content } = req.body;

        const auth_token = req.headers.auth;

        let author_id = NIL_UUID;

        if (content === undefined || content == null || content === "" || post_id === undefined || post_id === "" || content.length > 255) {
            res.status(400).json({message: "Invalid request!"});
            return;
        }

        stdLog.log("Post content edit requested: " + post_id, "API");

        let post_data = await postController.getPostById(post_id).catch(
            (err) => {
                stdLog.logError(err, "API");
                res.status(404).json({message: "Post not found!"});
                return;
            }
        );

        if (post_data === undefined) {
            res.status(404).json({message: "Post not found!"});
            return;
        }

        if (auth_token) {
            author_id = await userController.verifyAndDecodeAuthToken(auth_token);
            if (author_id !== undefined && author_id !== NIL_UUID && author_id != null && typeof author_id == "string") {
                stdLog.log("Author ID: " + author_id, "API");
                stdLog.log("Post author ID: " + post_data.author_id, "API");
                if (post_data.author_id !== author_id) {
                    stdLog.logError("User is not the author of this post!", "API");
                    res.status(401).json({message: "Unauthorized!"});
                    return;
                }
            }
        }

        if (post_data.author_id !== author_id) {
            res.status(401).json({message: "Unauthorized!"});
            stdLog.logError("Unauthorized post content edit!");
            return;
        }

        if (author_id === NIL_UUID) {
            res.status(401).json({message: "Unauthorized!"});
            stdLog.logError("Unauthorized post content edit!");
            return;
        }


        // Edit post content
        await postController.editPostContent(post_id, content).catch(
            (err) => {
                res.status(500).json({message: "Internal server error!"});
                stdLog.logError(err);
                return;
            }
        );

        // Respond with json data
        res.status(200).json("Post edited successfully!");
    } else {
        res.status(400).json({message: "Invalid request!"});
    }
}