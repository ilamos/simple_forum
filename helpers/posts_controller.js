

const fs = require('fs');
let posts = require('../data/posts.json');

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
    post.id = posts.length;
    posts.push(post);
    savePosts();
    return post.id;
}

function savePosts() {
    fs.writeFileSync('data/posts.json', JSON.stringify(posts));
}