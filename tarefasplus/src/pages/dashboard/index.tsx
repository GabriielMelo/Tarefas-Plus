import Textarea from "@/components/textarea";
import { addDoc, collection } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { ChangeEvent, FormEvent, useState } from "react";
import { FaCreativeCommonsShare, FaShare, FaTrash } from "react-icons/fa";

import styles from "./styles.module.css";
interface HomeProps {
  user: {
    email: string;
  };
}
interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  user: string;
  task: string;
}

export default function Dashboard({ user }: HomeProps) {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  function handleChangePublicTask(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  }
  async function handleAddTask(event: FormEvent) {
    event.preventDefault();
    if (input === "") {
      alert("Invalid Task");
      return;
    }
    try {
      await addDoc(collection(db, "tasks"), {
        task: input,
        created: new Date(),
        user: user?.email,
        public: publicTask,
      });
      setPublicTask(false);
      setInput("");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <main className={styles.container}>
      <Head>
        <title>Meu Painel de Tarefas</title>
      </Head>
      <section className={styles.content}>
        <article className={styles.contentForm}>
          <h1 className={styles.title}>Qual a sua Tarefa?</h1>
          <form onSubmit={handleAddTask}>
            <Textarea
              placeholder="Digite sua tarefa..."
              value={input}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                setInput(event.target.value)
              }
            />
            <div className={styles.checkboxArea}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={publicTask}
                onChange={handleChangePublicTask}
              />
              <label>Deixar a tarefa pública?</label>
            </div>
            <button className={styles.button} type="submit">
              Registrar
            </button>
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
      user: {
        email: session?.user?.email,
      },
    },
  };
};
