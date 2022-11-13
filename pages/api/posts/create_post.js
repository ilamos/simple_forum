import { postController } from "../../../helpers/api/posts_controller";
import { userController } from "../../../helpers/api/users_controller";
import { stdLog } from "../../../helpers/debug/log_helper";


export default function handler(req, res) {
    if (req.method == "POST") {
        // Handle create post requests
        const { title, content } = req.body;
        const auth_token = req.headers.auth;
        let author_name = "Anonymous";

        stdLog.log("Create post request: " + title, "API");

        if (auth_token) {
            let author_id = userController.checkAuth(auth_token);
            if (author_id != undefined && author_id != null && typeof author_id == "string") {
                stdLog.log("Author ID: " + author_id, "API");
                author_name = userController.getUserById(author_id).username;
            }
        }

        if (!content || !title || title.length < 1 || content.length < 1 || title.length > 30 || content.length > 255) {
            res.status(400).json({ error: "Invalid post data!" });
            stdLog.logError("Invalid post data!");
            return;
        }

        // Create a new post object
        let new_post = {
            title: title,
            content: content,
            author: author_name
        }

        // Add the new post to the posts array
        postController.createPost(new_post);
        res.status(200).json({message: "Post created successfully!"});
    } else {
        res.status(400).json({message: "Invalid request!"});
    }
}