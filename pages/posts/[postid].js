// Dynamically rendered page to handle a single post
import Image from "next/image";
import Head from "next/head";
import styles from '../../styles/Home.module.css'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {stdLog} from "../../helpers/debug/log_helper";
import Link from "next/link";
import { clientAPIhelper } from "../../helpers/client/api";


export default function Post() {
    const router = useRouter();

    const [post, setPost] = useState({title: "", content: "", author: "", date: ""});
    const [userdata, setUserdata] = useState({});
    const [is_author, setIsAuthor] = useState(false);

    let attemptPostDelete = () => {
        let response = clientAPIhelper.delete_post(post.id);
        response.then((status) => {
            if (status == 200) {
                router.push("/");
            } else {
                stdLog.log("Failed to delete post!", "API");
            }
        });
    }

    useEffect(() => {
        let { postid } = router.query;
        let data = {
            username: localStorage.getItem("user_name"),
            user_id: localStorage.getItem("user_id"),
            user_email: localStorage.getItem("user_email"),
            user_token: localStorage.getItem("user_token")
        }
        setUserdata(data);
        let post_prom = clientAPIhelper.get_post_by_id(postid);
        post_prom.then((post_data) => {
            setPost(post_data);
            if (post_data.author_id === data.user_id) {
                stdLog.log("User is author of this post!", "POST");
                setIsAuthor(true);
            }
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
            {is_author && <button onClick={ attemptPostDelete } className={`${styles.input_field} ${styles.input_button} ${styles.input_small_button}`} > Delete post </button> }
        </div>
        <div className={styles.post_footer}>
            <h3> <Link href="/">Go back</Link>  </h3>
        </div>
    </>
    )

}