import { stdLog } from "../debug/log_helper";

export const clientAPIhelper = {
    GetAllPosts,
    GetPostByID,
    CreatePost,
    DeletePost,
    LoginUser,
    RegisterUser
}

function GetAllPosts(post_title, post_content) {
    return new Promise((resolve, reject) => {
        const response = fetch("http://localhost:3000/api/posts/get_all_posts", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },

        }).then((response) => {
            stdLog.log("Get all posts status: " + response.status.toString());
            let response_promise = response.json();
            response_promise.then((response_data) => {
                // Add the posts to an array
                let posts = [];
                for (let i = 0; i < response_data.length; i++) {
                    posts.push(response_data[i]);
                }
                resolve(posts);
            });
        });
    });
}

function GetPostByID(postid) {
    return new Promise((resolve, reject) => {
        const response = fetch("http://localhost:3000/api/posts/get_post_by_id", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                post_id: postid
            })
        }).then((response) => {
            stdLog.log("Get post by ID status: " + response.status.toString());
            if (response.status == 200) {
                let response_prom = response.json();
                response_prom.then((response_data) => {
                    resolve(response_data);
                });
            } else {
                reject(response.status);
            }
        });
    });
}

function CreatePost(post_title, post_content) {
    return new Promise((resolve, reject) => {
        const auth_token = localStorage.getItem("user_token");
        const response = fetch("http://localhost:3000/api/posts/create_post", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                auth: auth_token
            },
            body: JSON.stringify({
                title: post_title,
                content: post_content
            })
        }).then((response) => {
            if (response.status == 200) {
                stdLog.log("Create post status: " + response.status.toString());
                resolve(response.status);
            } else {
                reject(response.status);
            }

        });
    });
}

function DeletePost(postid) {
    return new Promise((resolve, reject) => {
        const auth_token = localStorage.getItem("user_token");
        if (auth_token == null) {
            reject(401);
        }
        const response = fetch("http://localhost:3000/api/posts/delete_post", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                auth: auth_token
            },
            body: JSON.stringify({
                post_id: postid
            })
        }).then((response) => {
            if (response.status == 200) {
                stdLog.log("Delete post status: " + response.status.toString());
                resolve(response.status);
            } else {
                reject(response.status);
            }
        });
    });
}

function LoginUser(username, password) {
    return new Promise((resolve, reject) => {
        const response = fetch("http://localhost:3000/api/users/login_user", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then((response) => {
            stdLog.log("Login user status: " + response.status.toString());
            if (response.status == 200) {
                let response_prom = response.json();
                response_prom.then((response_data) => {
                    localStorage.setItem("user_name", response_data.username);
                    localStorage.setItem("user_id", response_data.id);
                    localStorage.setItem("user_email", response_data.email);
                    localStorage.setItem("user_token", response_data.token);
                    resolve(response.status);
                });
            } else {
                reject(response.status);
            }
        });
    });
}

function RegisterUser(username, email, password) {
    return new Promise((resolve, reject) => {
        const response = fetch("http://localhost:3000/api/users/create_user", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        }).then((response) => {
            stdLog.log("Create user status: " + response.status.toString());
            if (response.status == 200) {
                let response_prom = response.json();
                response_prom.then((response_data) => {
                    stdLog.log("Create user status: " + response.status.toString());
                    stdLog.log("Response data: " + JSON.stringify(response_data));
                    localStorage.setItem("user_name", response_data.username);
                    localStorage.setItem("user_id", response_data.id);
                    localStorage.setItem("user_email", response_data.email);
                    localStorage.setItem("user_token", response_data.token);
                    resolve(response.status);
                });
            } else {
                reject(response.status);
            }
        });
    });
}