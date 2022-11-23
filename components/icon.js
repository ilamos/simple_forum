import Image from "next/image";
import styles from '../styles/Home.module.css'
import {useEffect, useState} from "react";

const size_defs = {
    small: 10,
    medium: 20,
    large: 30,
}

export default function Icon({source, size, inverted}) {
    const [class_name, class_name_update] = useState(styles.icon);
    useEffect(() => {
        if (inverted) {
            class_name_update(styles.icon_inverted);
        }
    })

    return (
        <>
            <Image className={class_name} src={source} alt={source} width={size_defs[size]} height={size_defs[size]} />
        </>
    )
}