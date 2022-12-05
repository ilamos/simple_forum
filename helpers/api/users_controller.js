const bcrypt = require('bcryptjs');
const fs = require('fs');
const jwt = require('jsonwebtoken');
let users = require('../../data/users.json');
import getConfig from 'next/config';
import { v4 as uuidv4 } from 'uuid';
const { serverRuntimeConfig } = getConfig();

export const userController = {
    getAllUsers,
    getUserById,
    registerUser,
    loginUser,
    loginEmail,
    userNameExists,
    verifyAndDecodeAuthToken
}

function userNameExists(username) {
    return users.find(user => user.username == username);
}

function getAllUsers() {
    // Remove the password from the user object
    let tmp_users = users;
    for (let i = 0; i < tmp_users.length; i++) {
        delete tmp_users[i].password;
    }
    return tmp_users;
}

function getAllUserNames() {
    let usernames = [];
    for (let i = 0; i < users.length; i++) {
        usernames.push(users[i].username);
    }
    return usernames;
}

function getUserById(id) {
    let user = users.find(user => user.id == id);
    if (user && typeof user == "object") {
        delete user.password;
        return user;
    }
}

function createAuthToken(user) {
    const token = jwt.sign({ sub: user.id, tid: user.token_id }, serverRuntimeConfig.secret, {});
    return token;
}

function verifyAndDecodeAuthToken(token) {
    try {
        const decoded = jwt.verify(token, serverRuntimeConfig.secret);
        let token_id = decoded.tid;
        let user = getUserById(decoded.sub);
        let user_current_token_id = user.token_id;
        if (token_id === user_current_token_id) {
            return decoded.sub;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}



function registerUser(username, password, email) {
    password = bcrypt.hashSync(password, serverRuntimeConfig.bcrypt_salt);
    let user = {
        id: uuidv4(),
        username: username,
        password: password,
        token_id: uuidv4(),
        email: email
    }
    users.push(user);
    saveUsers();
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        token: createAuthToken(user)
    };
}

function loginUser(username, password) {
    let user = users.find(user => user.username == username);
    if (user && bcrypt.compareSync(password, user.password) === true) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            token: createAuthToken(user)
        };
    }
    return false;
}

function loginEmail(email, password) {
    let user = users.find(user => user.email == email);
    if (user && bcrypt.compareSync(password, user.password)) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            token: createAuthToken(user)
        };
    }
    return false;
}

function changePassword(id, new_password) {
    let user = getUserById(id);
    user.password = bcrypt.hashSync(new_password, serverRuntimeConfig.bcrypt_salt);
    user.token_id = uuidv4();
    saveUsers();
    return createAuthToken(user);
}

function saveUsers() {
    fs.writeFileSync('data/users.json', JSON.stringify(users));
}