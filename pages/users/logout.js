import { useRouter } from 'next/router';
import {useEffect, useState} from "react";

export default function RegisterAccount() {
    const router = useRouter();

    useEffect(() => {
          localStorage.setItem("user_name", "");
          localStorage.setItem("user_id", "");
          localStorage.setItem("user_email", "");
          localStorage.setItem("user_token", "");
          router.push("/").then(() => { console.log("Logged out.") });
    }, []);
}