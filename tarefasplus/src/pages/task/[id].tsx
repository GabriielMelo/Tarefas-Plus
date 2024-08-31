import Textarea from "@/components/textarea";
import { db } from "@/services/firebaseConnection";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { FaTrash } from "react-icons/fa";
import styles from "./styles.module.css";
interface TaskProps {
  task: {
    task: string;
    public: boolean;
    created: Date;
    user: string;
    taskId: string;
  };
  allComments: CommentProps[];
}
interface CommentProps {
  id: string;
  comment: string;
  taskId: string;
  user: string;
  name: string;
  image: string;
}

export default function Task({ task, allComments }: TaskProps) {
  const [input, setInput] = useState("");
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentProps[]>(allComments || []);

  async function handleComment(event: FormEvent) {
    event.preventDefault();
    if (input === "") return;
    if (!session?.user?.email || !session?.user?.name || !session?.user?.image)
      return;
    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        image: session?.user?.image,
        taskId: task?.taskId,
      });
      const data = [
        ...comments,
        {
          id: docRef.id,
          comment: input,
          user: session?.user?.email,
          name: session?.user?.name,
          image: session?.user?.image,
          taskId: task?.taskId,
        },
      ];
      console.log("data", data);
      setComments(data);
      setInput("");
    } catch (err) {
      console.log(err);
    }
  }
  async function handleDeleteComment(id: string) {
    try {
      const docRef = doc(db, "comments", id);
      await deleteDoc(docRef);
      const newComments = comments.filter((comment) => comment.id !== id);
      setComments(newComments);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <main className={styles.container}>
      <section className={styles.content}>
        <article className={styles.taskInfo}>
          <h1>Tarefa</h1>
          <p>Task</p>
        </article>
        <section className={styles.commentsForm}>
          <h2>Deixar um comentário</h2>
          <form onSubmit={handleComment}>
            <Textarea
              placeholder="Digite o seu comentário"
              maxLength={150}
              value={input}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                setInput(event.target.value);
              }}
            />
            <button className={styles.button}>Enviar comentário</button>
          </form>
        </section>
        <section className={styles.commentsContainer}>
          <h2>Todos os Comentários</h2>

          {comments.length === 0 && <span>Nenhum comentário</span>}

          {comments.map((comment) => {
            return (
              <article key={comment.id} className={styles.comments}>
                <div className={styles.profileComment}>
                  <div className={styles.profileInfo}>
                    <Image
                      src={comment.image}
                      width={50}
                      height={50}
                      alt="user profile image"
                      className={styles.profileImage}
                    />
                    <span>{comment.name}</span>
                  </div>
                  <p className={styles.comment}>{comment.comment}</p>
                </div>
                <button className={styles.trashButton}>
                  <FaTrash
                    size={18}
                    color="#ea3140"
                    onClick={() => handleDeleteComment(comment.id)}
                  />
                </button>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const docRef = doc(db, "tasks", id);

  const qry = query(collection(db, "comments"), where("taskId", "==", id));
  const snapShotComments = await getDocs(qry);

  let allComments: CommentProps[] = [];

  snapShotComments.forEach((comment) => {
    allComments.push({
      id: comment.id,
      comment: comment.data().comment,
      taskId: comment.data().taskId,
      user: comment.data().user,
      name: comment.data().name,
      image: comment.data().image,
    });
  });

  const snapShot = await getDoc(docRef);
  if (snapShot.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  if (!snapShot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const formattedDate = snapShot.data()?.created.seconds * 1000;

  const task = {
    task: snapShot.data()?.task,
    public: snapShot.data()?.public,
    created: new Date(formattedDate).toLocaleString(),
    user: snapShot.data()?.user,
    taskId: id,
  };
  return {
    props: {
      task: task,
      allComments: allComments,
    },
  };
};
