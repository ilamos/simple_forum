import styles from '../styles/Home.module.css'
import Link from "next/link";
import Icon from "./icon.js";
import { icon_library } from "./icon.js";

export default function Post({post, is_author, onDelete, onEdit, isLink}) {
    return (
        <div key={post.id} className={`${styles.fade_in_05} ${styles.post_main}`}>
            {isLink && <Link href={`posts/${post.id}`}> <h1>{post.title}</h1> </Link>}
            {!isLink && <h1>{post.title}</h1>}
            <p dangerouslySetInnerHTML={{__html: post.content}}></p>
            <div className={styles.post_footer}>
                <div name={"post-footer-text-container"}>
                    <p className={styles.post_footer_text}>Author: {post.author} - Created at: {new Date(post.time).toLocaleString()}</p>
                    {post.last_edited && <p className={styles.post_footer_text}>Last edited at: {new Date(post.last_edited).toLocaleString()}</p>}
                </div>

                <div className={styles.post_icon_container}>
                    {is_author && onDelete &&<div onClick={ onDelete } className={`${styles.clickable} ${styles.post_icon_link}`} > <p className={styles.post_icon}> <Icon size={20} inverted={true} icon={icon_library.TrashBin}/> </p> </div> }
                    {is_author && onEdit && <div onClick={ onEdit } className={`${styles.clickable} ${styles.post_icon_link}`} > <p className={styles.post_icon}> <Icon size={20} inverted={true} icon={icon_library.PenPaper}/> </p> </div> }
                </div>

            </div>
        </div>
    )
}