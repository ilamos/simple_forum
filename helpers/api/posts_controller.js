import {v4 as uuidv4} from 'uuid';
import prisma from "../db/prisma";
import {stdLog} from "../debug/log_helper";
import logToFile from "./log";


/* Prisma definitions */
/*

model Post  {
    id String @id @unique
    title String
    content String
    author String
    author_id String
    time String
    edit_history EditHistory[]
    last_edited DateTime?
}

model EditHistory {
    id String @id @unique
    old_content String
    new_content String
    time String
    post_id String
    post Post @relation(fields: [post_id], references: [id])
}

 */

export const postController = {
    getAllPosts,
    getPostById,
    createPost,
    deletePost,
    editPostContent
}

async function getAllPosts() {
    return await prisma.post.findMany().catch((err) => {
        stdLog.logError(err);
    });
}

async function getPostById(id) {
    return await prisma.post.findUnique({
        where: {
            id: id
        }
    }).catch((err) => {
        stdLog.logError(err);
    });
}

async function deletePost(id) {
    // First we must delete all edit history entries for this post
    // Otherwise we will get a foreign key constraint error
    await prisma.editHistory.deleteMany({
        where: {
            post_id: id
        }
    }).catch((err) => {
        stdLog.logError(err, "HIST_DELETE_ERROR");
    });

    await prisma.post.delete({
        where: {
            id: id
        }
    }).catch((err) => {
        stdLog.logError(err, "POST_DELETE_ERROR");
    });
    logToFile(`Post deleted [Post ID: ${id}]`);
}

async function editPostContent(id, new_content) {
    let post = await prisma.post.findUnique({
        where: {
            id: id
        }
    });

    await prisma.editHistory.create({
        data: {
            old_content: post.content,
            new_content: new_content,
            time: new Date(new Date().toUTCString()),
            post: { connect: { id: id } },
            id: id,
        },
    });

    await prisma.post.update({
        where: {
            id: id
        },
        data: {
            content: new_content,
        }
    });
}

async function createPost(title, content, author, author_id) {
    stdLog.log("Author: " + author)
    let post_id = uuidv4();
    await prisma.post.create({
        data: {
            id: post_id,
            title: title,
            content: content,
            author: author,
            author_id: author_id,
            time: new Date(new Date().toUTCString()),
            edit_history: { create: [] },
        }
    }).catch((err) => {
        stdLog.logError(err);
    });
    logToFile(`Post created by ${author} (${author_id}) [Post ID: ${post_id} | Title: ${title}]`);
}
