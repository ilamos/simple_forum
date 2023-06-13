import { userController } from "../../../helpers/api/users_controller";
import { isIllegalName, isAllowedChars } from "../../../helpers/dirs/names";
import {stdLog} from "../../../helpers/debug/log_helper";

export default async function handler(req, res) {
    if (req.method == "POST") {
        stdLog.log("User creation request received", "API");
        // Handle create post requests
        const { username, email, password } = req.body;

        if (await userController.emailInUse(email)) {
            console.log("Email already in use!");
            res.status(400).json({ error: "Email already in use!" });
            return;
        }

        if (!username || isIllegalName(username) || !isAllowedChars(username) || await userController.userNameExists(username) || !password || !email || username.length < 2 || password.length < 5 || email.length < 3 || !email.includes("@") || username.length > 20 || password.length > 50 || email.length > 50) {
            console.log("Invalid user data!");
            res.status(400).json({ error: "Invalid user data!" });
            return;
        }



        let user_data = await userController.registerUser(username, password, email);
        if (user_data) {
            res.status(200).json(user_data);
        } else {
            console.log("Failed to create user!");
            res.status(400).json({ error: "Failed to create user!" });
        }
    }
}