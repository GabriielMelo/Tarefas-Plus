import Textarea from "@/components/textarea";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaCreativeCommonsShare, FaShare, FaTrash } from "react-icons/fa";
import { db } from "../../services/firebaseConnection";
import styles from "./styles.module.css";
interface HomeProps {
  user: {
    email: string;
    image: string;
    name: string;
  };
}
interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  user: string;
  name: string;
  image: string;
  task: string;
}

export default function Dashboard({ user }: HomeProps) {
  const [input, setInput] = useState("");

  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  useEffect(() => {
    async function loadTasks() {
      const taskRef = collection(db, "tasks");
      const qry = query(taskRef, orderBy("created", "desc"));
      onSnapshot(qry, (snapshot) => {
        let list = [] as TaskProps[];
        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            created: doc.data().created,
            public: doc.data().public,
            user: doc.data().user,
            image: doc.data().image,
            name: doc.data().name,
            task: doc.data().task,
          });
        });
        setTasks(list);
      });
    }
    loadTasks();
  }, [user?.email]);

  async function handleCopyLink(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    );
  }
  async function handleDeleteTask(id: string) {
    const docRef = doc(db, "tasks", id);
    deleteDoc(docRef);
  }
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
        name: user?.name,
        image: user?.image,
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
        <title>Meu Painel de tarefas</title>
      </Head>
      <section className={styles.content}>
        <article className={styles.contentForm}>
          <h1>Qual a sua Tarefa?</h1>
          <form onSubmit={handleAddTask}>
            <Textarea
              placeholder="Digite sua tarefa até 150 caracteres"
              value={input}
              maxLength={150}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                setInput(event.target.value);
              }}
            />
            <div className={styles.checkContent}>
              <input
                type="checkbox"
                className={styles.checkBox}
                checked={publicTask}
                onChange={handleChangePublicTask}
              />
              <label>Deixar a tarefa pública?</label>
            </div>
            <button className={styles.submitButton} type="submit">
              Registrar
            </button>
          </form>
        </article>
      </section>
      <section className={styles.taskContent}>
        {tasks.length === 0 ? (
          <h2>Adicione uma tarefa</h2>
        ) : (
          <h2>Minhas Tarefas </h2>
        )}
        {tasks.map((task) => {
          return (
            <article key={task.id} className={styles.task}>
              <div className={styles.profile}>
                <div className={styles.profileImage}>
                  <Image
                    className={styles.profileImage}
                    src={task.image}
                    alt="profile Image"
                    width={50}
                    height={50}
                  />
                </div>
                <div className={styles.profileInfo}>
                  <div className={styles.profileName}>
                    <label>{task.name}</label>
                    {task.public ? (
                      <span className={styles.tagPrivacy}>Pública</span>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className={styles.taskDescription}>
                    {task.public ? (
                      <Link href={`/task/${task.id}`}>
                        <p>{task.task}</p>
                      </Link>
                    ) : (
                      <p>{task.task}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.tagContainer}>
                <div>
                  {task.public && (
                    <div className={styles.tags}>
                      <button
                        title="copy"
                        onClick={() => handleCopyLink(task.id)}
                      >
                        <FaCreativeCommonsShare size={24} color="#3183ff" />
                      </button>
                      <Link
                        title="new tab"
                        href={`${process.env.NEXT_PUBLIC_URL}/task/${task.id}`}
                        target="_blank"
                      >
                        <FaShare size={24} color="#3183ff" />{" "}
                      </Link>
                    </div>
                  )}
                </div>
                {user?.email === task.user && (
                  <div>
                    <button
                      title="delete"
                      className={styles.trashButton}
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <FaTrash size={20} color="#ea3140" />
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
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
        image: session?.user?.image,
        name: session?.user?.name,
      },
    },
  };
};
