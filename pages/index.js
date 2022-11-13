import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import {useEffect, useState} from "react";

function get_all_posts(post_title, post_content) {
    return new Promise((resolve, reject) => {
        const response = fetch("http://localhost:3000/api/posts/get_all_posts", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },

        }).then((response) => {
            console.log("Get all posts status: " + response.status.toString());
            let response_promise = response.json();
            response_promise.then((response_data) => {
                // Add the posts to an array
                let posts = [];
                for (let i = 0; i < response_data.length; i++) {
                    posts.push(response_data[i]);
                }
                console.log("Response data: " + response_data);
                resolve(posts);
            });
        });
    });
}

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [userdata, setUserdata] = useState({
        username: undefined,
        user_id: undefined,
        user_email: undefined,
        user_token: undefined
    });

    useEffect(() => {
        setUserdata({
            username: localStorage.getItem("user_name"),
            user_id: localStorage.getItem("user_id"),
            user_email: localStorage.getItem("user_email"),
            user_token: localStorage.getItem("user_token")
        })
        console.log("User data: " + JSON.stringify(userdata));
    }, [])


    useEffect(() => {
        get_all_posts().then(x => { setPosts(x.reverse()); });
    }, []);

    return (
      <div>
        <Head>
          <title>Forum app</title>
          <meta name="description" content="Simple forum" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
          <div className={styles.post_container}>
              <h1 className={styles.post_container_title}>Posts</h1>
              {userdata.username && userdata.user_id && userdata.user_email && userdata.user_token &&
                  <h2 className={styles.post_container_title} >Welcome, {userdata.username}!</h2>
              }
              <div className={styles.button_container}>
                  <Link className={styles.top_button} href="posts/create_post"><h3 >Create a post!</h3></Link>
                  {userdata.username && userdata.user_id && userdata.user_email && userdata.user_token &&
                      <Link className={styles.top_button} href="users/logout"><h3>Logout</h3></Link>
                  }
                    {!userdata.username && !userdata.user_id && !userdata.user_email && !userdata.user_token &&
                        <Link className={styles.top_button} href="users/register"><h3 >Register</h3></Link>}
                  {!userdata.username && !userdata.user_id && !userdata.user_email && !userdata.user_token &&
                      <Link className={styles.top_button} href="users/login"><h3>Login</h3></Link>  }
              </div>

              {posts && posts.map(post =>
                    <div key={post.id} className={styles.post_main}>
                        <h1>{post.title}</h1>
                        <p className={styles.post_content} >{post.content}</p>
                        <p className={styles.post_footer_text}>Author: {post.author} - Created at: {new Date(post.time).toLocaleString()}</p>

                    </div>
              )}
          </div>
        </div>
    )
}
