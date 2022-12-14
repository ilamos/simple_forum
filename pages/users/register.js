import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router';
import {useEffect, useState} from "react";
import { isAllowedChars, isIllegalName } from "../../helpers/dirs/names";
import {clientAPIhelper} from "../../helpers/client/api";




export default function RegisterAccount() {
    const [writing_state, writing_update] = useState({username: "", password: "", password_confirm: "", email: ""});
    const [error, setError] = useState("");
    const router = useRouter();
    let are_default = {
        username: true,
        email: true,
        password: true,
        password_confirm: true
    }
    const [are_default_state, are_default_update] = useState(are_default);

    let tmp_state = {username: "", password: "", password_confirm: "", email: ""};

    let onWritingEvent = (event) => {
        tmp_state = writing_state;
        tmp_state[event.target.name] = event.target.value;
        // console.log("Writing state: " + JSON.stringify(writing_state));
        writing_update(tmp_state);
        are_default = are_default_state;
        are_default[event.target.name] = false;
        are_default_update(are_default);
        if ((!tmp_state.username || tmp_state.username.length < 2 || tmp_state.username.length > 20) && !are_default_state.username) {
            setError("Invalid username! (Min 2 chars, Max 20 chars");
            return;
        }

        if (!isAllowedChars(tmp_state.username) && !are_default_state.username) {
            setError("Invalid username! (Only letters and numbers)");
            return;
        }

        if ( isIllegalName(tmp_state.username) && !are_default_state.username ) {
            setError("Invalid username! (Name not allowed!)");
            return;
        }
        if ((!tmp_state.email || tmp_state.email.length < 3 || tmp_state.email.length > 50 || !tmp_state.email.includes("@")) && !are_default_state.email) {
            setError("Invalid email! (Min 3 chars, Max 50 chars)");
            return;
        }
        if ((!tmp_state.password || tmp_state.password.length < 5 || tmp_state.password.length > 50) && !are_default_state.password) {
            setError("Invalid password! (Min 5 chars, Max 50 chars)");
            return;
        }
        if (!(tmp_state.password_confirm == tmp_state.password) && !are_default_state.password_confirm) {
            setError("Passwords do not match!");
            return;
        }
        setError("");
    }

    return (
        <>
            <Head>
                <title>Register</title>
            </Head>
            <div className={styles.post_main}>
                <div className={styles.post_top}>
                    <h1>Register an account.</h1>
                    <h3>Welcome to the community!</h3>
                </div>
                <div className={styles.form_container}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (error.length == 0 || error.includes("Failed to create user!")) {
                            clientAPIhelper.RegisterUser(writing_state.username, writing_state.email, writing_state.password).then(
                                (status) => {
                                    if (status == 200) {
                                        router.push("/");
                                    } else {
                                        setError("Failed to create user!");
                                    }
                                });
                        }
                    } }>
                        { error && error.length > 0 && <p className={styles.error}>{error}</p> }
                        <label className={styles.input_label} htmlFor="username">Username (Unique)</label> <br></br>
                        <input className={styles.input_field} type="text" name="username" id="username" onChange={onWritingEvent}></input> <br></br>
                        <label className={styles.input_label} htmlFor="email">Email</label> <br></br>
                        <input className={styles.input_field} type="email" name="email" id="email" onChange={onWritingEvent}></input> <br></br>
                        <label className={styles.input_label} htmlFor="password">Password</label> <br></br>
                        <input className={styles.input_field} type="password" name="password" id="password" onChange={onWritingEvent}></input> <br></br>
                        <label className={styles.input_label} htlmFor="password_confirm">Confirm Password</label> <br></br>
                        <input className={styles.input_field} type="password" name="password_confirm" id="password_confirm" onChange={onWritingEvent}></input> <br></br>
                        <input className={`${styles.input_field} ${styles.input_button}`} type="submit" value="Register"></input>
                    </form>
                </div>
            </div>
            <div className={styles.post_below}>
                <h3> <Link href="/">Go back</Link>  </h3>
            </div>

        </>);
}
