import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router';
import {useEffect, useState} from "react";
import {clientAPIhelper} from "../../helpers/client/api";



export default function LoginAccount() {
    const [writing_state, writing_update] = useState({username: "", password: "", password_confirm: "", email: ""});
    const [error, setError] = useState("");
    const router = useRouter();
    let tmp_state = {username: "", password: "", password_confirm: "", email: ""};

    let on_writing_event = (event) => {
        tmp_state = writing_state;
        tmp_state[event.target.name] = event.target.value;
        // console.log("Writing state: " + JSON.stringify(writing_state));
        writing_update(tmp_state);

        setError("");
    }

    return (
        <>
            <Head>
                <title>Log in</title>
            </Head>
            <div className={styles.post_main}>
                <div className={styles.post_top}>
                    <h1>Log in.</h1>
                    <h3>Log into an existing account.</h3>
                </div>
                <div className={styles.form_container}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (error.length == 0) {
                            clientAPIhelper.login_user(writing_state.username, writing_state.password).then(
                                (status) => {
                                    if (status == 200) {
                                        router.push("/");
                                    } else {
                                        setError("Failed to log in. (Password incorrect / Wrong username)!");
                                    }
                                }).catch((status) => {

                                setError("Failed to log in. (Password incorrect / Wrong username)! ");
                            });
                        }
                    } }>
                        { error && error.length > 0 && <p className={styles.error}>{error}</p> }
                        <label className={styles.input_label} htmlFor="username">Username/Email</label> <br></br>
                        <input className={styles.input_field} type="text" name="username" id="username" onChange={on_writing_event}></input> <br></br>
                        <label className={styles.input_label} htmlFor="password">Password</label> <br></br>
                        <input className={styles.input_field} type="password" name="password" id="password" onChange={on_writing_event}></input> <br></br>
                        <input className={`${styles.input_field} ${styles.input_button}`} type="submit" value="Login"></input>
                    </form>
                </div>
            </div>
            <div className={styles.post_footer}>
                <h3> <Link href="/">Go back</Link>  </h3>
            </div>

        </>);
}
