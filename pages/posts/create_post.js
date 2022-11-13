import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import styles from '../../styles/Home.module.css'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

function create_post(post_title, post_content) {
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
                console.log("Create post status: " + response.status.toString());
                resolve(response.status);
            } else {
                reject(response.status);
            }

        });
    });

}


export default function CreatePost() {
    const [writing_state, writing_update] = useState({post_title: "", post_content: ""});
    const [error, setError] = useState("");
    const router = useRouter();
    let tmp_state = {post_title: "", post_content: ""};
    const [userdata, setUserdata] = useState({});

    useEffect(() => {
        let data = {
            username: localStorage.getItem("user_name"),
            user_id: localStorage.getItem("user_id"),
            user_email: localStorage.getItem("user_email"),
            user_token: localStorage.getItem("user_token")
        }
        setUserdata(data);
    }, []);

    let on_writing_event = (event) => {
        tmp_state = writing_state;
        tmp_state[event.target.name] = event.target.value;
        // console.log("Writing state: " + JSON.stringify(writing_state));
        writing_update(tmp_state);
        if (tmp_state.post_title != undefined && tmp_state.post_content != undefined) {
            if (tmp_state.post_title.length > 0 && tmp_state.post_content.length > 0) {
                if (tmp_state.post_content.length > 255) {
                    setError("Too long post content! (MAX 255 CHARS)");
                } else if (tmp_state.post_title.length > 30) {
                    setError("Too long post title! (MAX 30 CHARS)");
                } else {
                    setError("");
                }
            } else {
                setError("Please fill out all fields!");
            }
        } else {
            setError("");
        }
        // console.log("Error: " + error);
    }

    return (
    <>
        <Head>
            <title>Create a post</title>
        </Head>
        <div className={styles.post_main}>
        <div className={styles.post_top}>
            <h1>Create a post</h1>
            <Image className={`${styles.post_image}`} src={"/images/13798.jpg"} alt={"Post image"} height={144} width={144}></Image>
            <h3>Think hard about what to include!</h3>

            { !userdata.username && <h4>You are not logged in, your post will appear as Anonymous.</h4> }
            { userdata.username && <h4>You will appear on the post as '{userdata.username}'.</h4> }
        </div>
            <div className={styles.form_container}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (error.length == 0) {
                        create_post(e.target[0].value, e.target[1].value).then((response) => {
                            console.log("Response: " + response);
                            router.push("/");
                        });
                    }
                } }>
                    { error && error.length > 0 && <p className={styles.error}>{error}</p> }
                    <label htmlFor="post_title">Post Title</label> <br></br>
                    <input className={styles.input_field} onChange={on_writing_event} type="text" id="post_title" name="post_title"></input> <br></br>
                    <label htmlFor="post_content">Post Content</label> <br></br>
                    <textarea className={`${styles.input_field} ${styles.text_area}`} onChange={on_writing_event} type="text" id="post_content" name="post_content"></textarea> <br></br>
                    <input className={`${styles.input_field} ${styles.input_button}`} type="submit" value="Create post"></input>
                </form>
            </div>
        </div>
        <div className={styles.post_footer}>
            <h3> <Link href="/">Go back</Link>  </h3>
        </div>

    </>);
}
