import Head from "next/head";
import Image from "next/image";
import logo from "../../public/assets/logo.png";
import styles from "../styles/Home.module.css";
export default function Home() {
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
              <span>{}0 Posts</span>
            </article>
            <article className={styles.box}>
              <span>{}0 Comentários</span>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
