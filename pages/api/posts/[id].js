import { postController } from "../../../helpers/posts_controller";

export default function handler(req, res) {
    if (req.method == "GET") {
        const { id } = req.query;
        console.log("Post requested: " + id);

        // Return a response
        let response_data = postController.getPostById(id);
        if (response_data == undefined) {
            res.status(404).json({message: "Post not found!"});
        }

        // Respond with json data
        res.status(200).json(response_data);
    }
}