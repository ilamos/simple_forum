import { userController } from "../../../helpers/api/users_controller";

export default function handler(req, res) {
    if (req.method == "POST") {
        // Handle login requests
        const { username, password } = req.body;

        if (!username || !password || username.length < 2 || password.length < 5 || username.length > 20 || password.length > 50) {
            res.status(400).json({ error: "Invalid login data!" });
            return;
        }

        let user_data;

        if (username.includes("@")) {
            user_data = userController.loginEmail(username, password);
        } else {
            user_data = userController.loginUser(username, password);
        }

        if (user_data) {
            res.status(200).json(user_data);
        } else {
            res.status(400).json({ error: "Invalid login data!" });
        }
    }
}