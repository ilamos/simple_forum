const bcrypt = require('bcryptjs');
const fs = require('fs');
const jwt = require('jsonwebtoken');
import getConfig from 'next/config';
import { v4 as uuidv4 } from 'uuid';
const { serverRuntimeConfig } = getConfig();
import logToFile from "./log";
import prisma from "../db/prisma";
import { stdLog } from '../debug/log_helper';

/* await prisma definitions */
/*
model User {
    id String @id
    username String
    password String
    token_id String
    email String
}
 */

// Currently transitioning the user database to await prisma

export const userController = {
    getAllUsers,
    getUserById,
    registerUser,
    loginUser,
    loginEmail,
    userNameExists,
    verifyAndDecodeAuthToken,
    emailInUse,
}

async function userNameExists(username) {
    return await prisma.user.findUnique({
        where: {
            username: username
        }
    }).catch((err) => {
        stdLog.logError(err);
    });
}

async function emailInUse(email) {
    return await prisma.user.findUnique({
        where: {
            email: email
        }
    }).catch((err) => {
        stdLog.logError(err);
    });
}

async function getAllUsers() {

    let tmp_users = await prisma.user.findMany().catch((err) => {
        stdLog.logError(err);
    });
    for (let i = 0; i < tmp_users.length; i++) {
        delete tmp_users[i].password; // Remove the password from the user object
    }
    return tmp_users;
}

async function getAllUserNames() {

    let usernames = [];
    let tmp_users = await prisma.user.findMany().catch((err) => {
        stdLog.logError(err);
    });
    for (let i = 0; i < tmp_users.length; i++) {
        usernames.push(tmp_users[i].username);
    }
    return usernames;
}

async function getUserById(id) {

    let user = await prisma.user.findUnique({
        where: {
            id: id
        }
    }).catch((err) => {
        stdLog.logError(err);
    });
    if (user) {
        delete user.password;
        return user;
    }
}

async function createAuthToken(user) {
    const token = jwt.sign({ sub: user.id, tid: user.token_id }, serverRuntimeConfig.secret, {});
    return token;
}

async function verifyAndDecodeAuthToken(token) {
    try {
        const decoded = jwt.verify(token, serverRuntimeConfig.secret);
        let token_id = decoded.tid;
        let user = await getUserById(decoded.sub);
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



async function registerUser(username, password, email) {
    password = bcrypt.hashSync(password, serverRuntimeConfig.bcrypt_salt);
    let user = {
        id: uuidv4(),
        username: username,
        password: password,
        token_id: uuidv4(),
        email: email
    }

    await prisma.user.create({
        data: {
            id: user.id,
            username: user.username,
            password: user.password,
            token_id: user.token_id,
            email: user.email
        }
    }).catch((err) => {
        stdLog.logError("Register error prisma: " + err);
    });
    logToFile(`User ${user.username} registered`);
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        token: await createAuthToken(user)
    };
}

async function loginUser(username, password) {
    let user = await prisma.user.findUnique({
        where: {
            username: username
        }
    }).catch((err) => {
        stdLog.logError(err);
    });
    if (user && bcrypt.compareSync(password, user.password) === true) {
        let user_token = await createAuthToken(user);
        stdLog.log("User token: " + user_token);
        let user_object = {
            id: user.id,
            username: user.username,
            email: user.email,
            token: user_token
        };
        return user_object;
    }
    return false;
}

async function loginEmail(email, password) {
    let user = await prisma.user.findUnique({
        where: {
            email: email
        }
    }).catch((err) => {
        stdLog.logError(err);
    });
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

async function changePassword(id, new_password) {
    let user = await getUserById(id);
    user.password = bcrypt.hashSync(new_password, serverRuntimeConfig.bcrypt_salt);
    user.token_id = uuidv4();
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            password: user.password,
            token_id: user.token_id
        }
    }).catch((err) => {
        stdLog.logError(err);
    });
    return createAuthToken(user);
}

async function saveUsers() {
    fs.writeFileSync('data/users.json', JSON.stringify(users));
}