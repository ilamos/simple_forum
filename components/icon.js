import Image from "next/image";
import styles from '../styles/Home.module.css'
import {useEffect, useState} from "react";

export default function Icon({name, size, inverted}) {
    const [class_name, class_name_update] = useState(styles.icon);
    useEffect(() => {
        if (inverted) {
            class_name_update(styles.icon_inverted);
        } else {
            class_name_update(styles.icon); // Fix for fast refresh
        }
    })

    return (
        <>
            <Image className={class_name} src={`/images/icons/${name}.svg`} alt={`Icon: ${name}`} width={size} height={size} />
        </>
    )
}