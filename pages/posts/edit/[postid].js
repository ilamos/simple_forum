// Dynamically rendered page to handle a single post
import Image from "next/image";
import Head from "next/head";
import styles from '../../../styles/Home.module.css'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {stdLog} from "../../../helpers/debug/log_helper";
import Link from "next/link";
import { clientAPIhelper } from "../../../helpers/client/api";


export default function PostEdit() {
    const router = useRouter();

    const [post, setPost] = useState({title: "", content: "", author: "", date: ""});
    const [content_state, updateContentState] = useState("")
    const [userdata, setUserdata] = useState({});
    const [error, setError] = useState("");
    const [is_author, setIsAuthor] = useState(false);

    let attemptPostSave = () => {
        if (content_state == post.content) {
            setError("Post content must be different.")
        }
        let response = clientAPIhelper.EditPostContent(post.id, content_state);
        response.then((status) => {
            if (status == 200) {
                router.push(`/posts/${post.id}`);
            } else {
                stdLog.logWarning("Failed to edit post!", "API");
            }
        });
    }

    let onContentUpdate = (event) => {
        updateContentState(event.target.value);
        if (event.target.value.length > 255) {
            setError("Post max length is 255 characters.")
            return
        }
        setError("");
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
        let post_prom = clientAPIhelper.GetPostByID(postid);
        post_prom.then((post_data) => {
            setPost(post_data);
            if (post_data.author_id === data.user_id) {
                stdLog.log("User is author of this post!", "POST");
                setIsAuthor(true);
            } else {
                router.push(`/posts/${post_data.id}`)
                stdLog.logError("User is not authorized to edit!", "EDIT")
            }
        }).catch((error) => {
            stdLog.logError("Failed to get post data: " + error, "EDIT");
            setPost({title: "Post not found!", content: "Post not found!", author: "Post not found!", date: "Post not found!"});
        });
    }, [router.isReady]);
    return (
        <>
            <Head>
                <title>Editing: {post.title}</title>
            </Head>
            <div key={post.id} className={styles.post_main}>
                <h1>{post.title}</h1>
                { error && error.length > 0 && <p className={styles.error}>{error}</p> }
                <textarea onChange={onContentUpdate} className={`${styles.input_field} ${styles.text_area}`} defaultValue={post.content} ></textarea> <br/>
                {is_author && <button onClick={ attemptPostSave } className={`${styles.input_field} ${styles.input_button} ${styles.input_small_button}`} > Save! </button> }
            </div>
            <div className={styles.post_below}>
                <h3> <Link href={`/posts/${post.id}`}>Back to post</Link>  </h3>
            </div>
        </>
    )

}