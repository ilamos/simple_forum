// noinspection JSUnusedGlobalSymbols

import { postController } from "../../../helpers/api/posts_controller";
import { userController } from "../../../helpers/api/users_controller";
import { stdLog } from "../../../helpers/debug/log_helper";
import { NIL as NIL_UUID } from "uuid";


export default async function handler(req, res) {
    if (req.method === "POST") {
        // Handle create post requests
        const {title, content} = req.body;
        const auth_token = req.headers.auth;
        let author_name = "Anonymous";
        let author_id = NIL_UUID;
        stdLog.log("Create post request: " + title, "API");

        if (auth_token && typeof auth_token == "string") {
            stdLog.log("Auth token: " + JSON.stringify(auth_token), "API")
            author_id = await userController.verifyAndDecodeAuthToken(auth_token);
            stdLog.log("Author ID: " + author_id, "API");
            if (author_id !== undefined && author_id !== NIL_UUID && author_id != null && typeof author_id == "string") {
                let author_user = await userController.getUserById(author_id);
                stdLog.log("Author user: " + JSON.stringify(author_user), "API");
                if (author_user !== undefined && author_user !== null) {
                    author_name = author_user.username;
                }
                stdLog.log("Author name: " + author_name, "API");
            }
        }

        if (!content || !title || title.length < 1 || content.length < 1 || title.length > 30 || content.length > 255) {
            res.status(400).json({error: "Invalid post data!"});
            stdLog.logError("Invalid post data!");
            return;
        }

        // Strip HTML tags from post content
        let stripped_content = content.replace(/(<([^>]+)>)/gi, "");

        // Create a new post object

        stripped_content = stripped_content.replace(/\r?\n/g, "<br/>") // Fixes newlines


        // Create the post
        await postController.createPost(title, stripped_content, author_name, author_id)
        res.status(200).json({message: "Post created successfully!"});
    } else {
        res.status(400).json({message: "Invalid request!"});
    }
}