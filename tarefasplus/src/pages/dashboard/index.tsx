import Textarea from "@/components/textarea";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { FaCreativeCommonsShare, FaShare, FaTrash } from "react-icons/fa";
import styles from "./styles.module.css";

interface HomeProps {
  user: {
    email: string;
  };
}

export default function Dashboard({ user }: HomeProps) {
  return (
    <main className={styles.container}>
      <Head>
        <title>Meu Painel de Tarefas</title>
      </Head>
      <section className={styles.content}>
        <article className={styles.contentForm}>
          <h1 className={styles.title}>Qual a sua Tarefa?</h1>
          <form>
            <Textarea placeholder="Digite sua tarefa..." />
            <div className={styles.checkboxArea}>
              <input type="checkbox" className={styles.checkbox} />
              <label>Deixar a tarefa pública?</label>
            </div>
            <button className={styles.button}>Registrar</button>
          </form>
        </article>
      </section>
      <section className={styles.taskContainer}>
        <h1>Minhas Tarefas </h1>
        <article className={styles.tasks}>
          <div className={styles.tagContainer}>
            <label className={styles.tag}>Público</label>
            <button>
              <FaCreativeCommonsShare size={22} color="#3183ff" />
            </button>
            <button>
              <FaShare size={22} color="#3183ff" />
            </button>
          </div>

          <div className={styles.taskContent}>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos
              eligendi odio architecto voluptatem iusto animi culpa maxime
              veniam labore quam possimus praesentium sed itaque modi
            </p>
            <button>
              <FaTrash size={22} color="#ea3140" />
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      user: session?.user?.email,
    },
  };
};
