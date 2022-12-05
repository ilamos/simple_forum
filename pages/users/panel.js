import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import styles from '../../styles/Home.module.css'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import { clientAPIhelper } from "../../helpers/client/api";


export default function CreatePost() {
    const router = useRouter();

    useEffect(() => {

    }, [router.isReady]);


    return (
        <>
        </>
    );
}
