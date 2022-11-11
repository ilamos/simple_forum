import { userController } from "../../../helpers/users_controller";

export default function handler(req, res) {
    if (req.method == "POST") {
        console.log("Request for creating a new user received!");
        // Handle create post requests
        const { username, email, password } = req.body;

        if (!username || userController.userNameExists(username) || !password || !email || username.length < 2 || password.length < 5 || email.length < 1 || !email.includes("@") || username.length > 20 || password.length > 50 || email.length > 50) {
            console.log("Invalid user data!");
            res.status(400).json({ error: "Invalid user data!" });
            return;
        }


        let user_data = userController.registerUser(username, password, email);
        if (user_data) {
            res.status(200).json(user_data);
        } else {
            console.log("Failed to create user!");
            res.status(400).json({ error: "Failed to create user!" });
        }
    }
}