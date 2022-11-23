import Image from "next/image";
import styles from '../styles/Home.module.css'
import {useEffect, useState} from "react";

export const icon_library = {
    TrashBin: "trash",
    PenPaper: "pen_paper",
}

export default function Icon({icon, size, inverted}) {
    const [class_name, class_name_update] = useState(styles.icon);
    useEffect(() => {
        if (inverted) {
            class_name_update(`${styles.icon} ${styles.image_inverted}`);
        } else {
            class_name_update(styles.icon); // Fix for fast refresh
        }
    })

    return (
        <>
            <Image className={class_name} src={`/images/icons/${icon}.svg`} alt={`Icon: ${icon}`} width={size} height={size} />
        </>
    )
}