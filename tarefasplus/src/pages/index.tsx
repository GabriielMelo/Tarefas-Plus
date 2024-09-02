import { db } from "@/services/firebaseConnection";
import { collection, getDocs } from "firebase/firestore";
import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import logo from "../../public/assets/logo.png";
import styles from "../styles/Home.module.css";

interface HomeProps {
  posts: number;
  comments: number;
}
export default function Home({ posts, comments }: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil</title>
      </Head>
      <main>
        <section className={styles.logoContent}>
          <Image
            src={logo}
            alt="Logo Tarefas+"
            className={styles.logo}
            priority
          />
          <h1 className={styles.title}>
            Sistema feito para voce organizar seus estudos e tarefas
          </h1>
          <div className={styles.infoContent}>
            <article className={styles.box}>
              <span>{posts} Posts</span>
            </article>
            <article className={styles.box}>
              <span>{comments} Comentários</span>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const commentRef = collection(db, "comments");
  const postRef = collection(db, "tarefas");
  const postSnapshot = await getDocs(postRef);
  const commentSnapShot = await getDocs(commentRef);

  return {
    props: {
      posts: postSnapshot.size || 0,
      comments: commentSnapShot.size || 0,
    },
    revalidate: 60,
  };
};
