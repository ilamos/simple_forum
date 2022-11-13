
import { v4 as uuidv4 } from 'uuid';
const fs = require('fs');
let posts = require('../../data/posts.json');

export const postController = {
    getAllPosts,
    getPostById,
    createPost
}

function getAllPosts() {
    return posts;
}

function getPostById(id) {
    return posts.find(post => post.id == id);
}

function createPost(post) {
    post.id = uuidv4();
    post.time = new Date(new Date().toUTCString());
    posts.push(post);
    savePosts();
    return post.id;
}

function savePosts() {
    fs.writeFileSync('data/posts.json', JSON.stringify(posts));
}