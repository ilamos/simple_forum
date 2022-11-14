
import { v4 as uuidv4 } from 'uuid';
const fs = require('fs');
let posts = require('../../data/posts.json');
let replies = require('../../data/replies.json');

export const postController = {
    getAllPosts,
    getPostById,
    createPost,
    deletePost,
    editPostContent
}

function getAllPosts() {
    return posts;
}

function getPostById(id) {
    return posts.find(post => post.id == id);
}

function deletePost(id) {
    posts = posts.filter(post => post.id != id);
    savePosts();
}

function editPostContent(id, content) {
    let post = getPostById(id);
    post.content = content;
    savePosts();
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
function saveReplies() {
    fs.writeFileSync('data/replies.json', JSON.stringify(replies));
}