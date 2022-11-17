import styles from '../styles/Home.module.css'
import Link from "next/link";

export default function Post({post, is_author, onDelete, onEdit, isLink}) {
    return (
        <div key={post.id} className={styles.post_main}>
            {isLink && <Link href={`posts/${post.id}`}> <h1>{post.title}</h1> </Link>}
            {!isLink && <h1>{post.title}</h1>}
            <p dangerouslySetInnerHTML={{__html: post.content}}></p>
            <p className={styles.post_footer_text}>Author: {post.author} - Created at: {new Date(post.time).toLocaleString()}</p>
            {post.last_edited && <p className={styles.post_footer_text}>Last edited at: {new Date(post.last_edited).toLocaleString()}</p>}
            {is_author && onDelete &&<button onClick={ onDelete } className={`${styles.input_field} ${styles.input_button} ${styles.input_small_button}`} > Delete post </button> }
            {is_author && onEdit && <button onClick={ onEdit } className={`${styles.input_field} ${styles.input_button} ${styles.input_small_button}`} > Edit post </button> }
        </div>
    )
}