import { GetStaticPaths ,GetStaticProps } from "next"
import { useSession } from "next-auth/react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { RichText } from "prismic-dom"
import { useEffect } from "react"
import { getPrismicClient } from "../../../services/prismic"
import styles from '../post.module.scss'

interface PostPreviewProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function PostPreview({ post }: PostPreviewProps) {
    const {data: session} = useSession();
    const router = useRouter()

    useEffect(() => {
      if (session?.activeSubscription) {
        router.push(`/posts/${post.slug}`)
      }
    }, [session])

    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div className={`${styles.postContent} ${styles.previewContent}`} dangerouslySetInnerHTML={{ __html: post.content }}></div>
                <div className={styles.continueReading}> Você gostaria de ter acesso a todo o conteúdo? 
                <Link href='/'><a>Assine agora! 🤗</a></Link>
                </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params;

    const prismic = getPrismicClient()

    const res = await prismic.getByUID<any>('publication', String(slug), {})

    const post = {
        slug,
        title: RichText.asText(res.data.title),
        content: RichText.asHtml(res.data.content.splice(0, 3)),
        updatedAt: new Date(res.last_publication_date).toLocaleDateString(
            "pt-BR",
            {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
    }

    return {
        props: {
            post,
        },
        redirect: 60 * 30 // 30 Minutos
    }
}