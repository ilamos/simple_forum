import { userController } from "../../../helpers/api/users_controller";
import {stdLog} from "../../../helpers/debug/log_helper";

export default async function handler(req, res) {
    if (req.method === "POST") {
        // Handle login requests
        const { username, password } = req.body;

        stdLog.log("Login request received for user: " + username, "API");

        if (!username || !password || username.length < 2 || password.length < 5 || username.length > 20 || password.length > 50) {
            res.status(400).json({ error: "Invalid login data!" });
            return;
        }

        let user_data;

        if (username.includes("@")) {
            user_data = await userController.loginEmail(username, password);
        } else {
            user_data = await userController.loginUser(username, password);
        }
        stdLog.log("User data: " + JSON.stringify(user_data), "API");
        if (user_data) {
            res.status(200).json(user_data);
        } else {
            res.status(400).json({ error: "Invalid login data!" });
        }
    }
}