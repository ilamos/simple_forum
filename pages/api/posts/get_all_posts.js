import { postController } from "../../../helpers/api/posts_controller";

export default function handler(req, res) {
    if (req.method == "GET") {
        // Return a response
        let response_data = postController.getAllPosts()
        if (response_data == undefined) {
            res.status(404).json({message: "Posts not found!"});
        }

        // Respond with json data
        res.status(200).json(response_data);
    }
}