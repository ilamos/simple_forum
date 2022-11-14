import { postController } from "../../../helpers/api/posts_controller";
import { userController } from "../../../helpers/api/users_controller";
import { stdLog } from "../../../helpers/debug/log_helper";
import { NIL as NIL_UUID } from "uuid";


export default function handler(req, res) {
    if (req.method == "POST") {
        // Handle create post requests
        const {title, content} = req.body;
        const auth_token = req.headers.auth;
        let author_name = "Anonymous";
        let author_id = NIL_UUID;
        stdLog.log("Create post request: " + title, "API");

        if (auth_token) {
            author_id = userController.verifyAndDecodeAuthToken(auth_token);
            if (author_id != undefined && author_id != NIL_UUID && author_id != null && typeof author_id == "string") {
                stdLog.log("Author ID: " + author_id, "API");
                author_name = userController.getUserById(author_id).username;
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
        let new_post = {
            title: title,
            content: stripped_content.replace(/\r?\n/g, "<br/>"), // Fixes newlines
            author: author_name,
            author_id: author_id
        }

        // Add the new post to the posts array
        postController.createPost(new_post);
        res.status(200).json({message: "Post created successfully!"});
    } else {
        res.status(400).json({message: "Invalid request!"});
    }
}