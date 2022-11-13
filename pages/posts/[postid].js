// Dynamically rendered page to handle a single post
import Image from "next/image";
import Head from "next/head";
import styles from '../../styles/Home.module.css'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {stdLog} from "../../helpers/debug/log_helper";
import Link from "next/link";

function get_post_by_id(postid) {
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
            console.log("Get post by ID status: " + response.status.toString());
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

export default function Post() {
    const router = useRouter();
    const [post, setPost] = useState({title: "", content: "", author: "", date: ""});
    const [userdata, setUserdata] = useState({});

    useEffect(() => {
        const { postid } = router.query;
        let data = {
            username: localStorage.getItem("user_name"),
            user_id: localStorage.getItem("user_id"),
            user_email: localStorage.getItem("user_email"),
            user_token: localStorage.getItem("user_token")
        }
        setUserdata(data);
        let post_prom = get_post_by_id(postid);
        post_prom.then((post_data) => {
            setPost(post_data);
        }).catch((error) => {
            stdLog.logError("Failed to get post data: " + error, "Post page");
            setPost({title: "Post not found!", content: "Post not found!", author: "Post not found!", date: "Post not found!"});
        });
    }, []);
    return (
    <>
        <Head>
            <title>{post.title}</title>
        </Head>
        <div key={post.id} className={styles.post_main}>
            <h1>{post.title}</h1>
            <p className={styles.post_content} >{post.content}</p>
            <p className={styles.post_footer_text}>Author: {post.author} - Created at: {new Date(post.time).toLocaleString()}</p>
        </div>
        <div className={styles.post_footer}>
            <h3> <Link href="/">Go back</Link>  </h3>
        </div>
    </>
    )

}