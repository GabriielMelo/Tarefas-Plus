import Textarea from "@/components/textarea";
import { FaTrash } from "react-icons/fa";
import styles from "./styles.module.css";

export default function task() {
  return (
    <main className={styles.container}>
      <section className={styles.content}>
        <article className={styles.taskInfo}>
          <h1>Tarefa</h1>
          <p>Task</p>
        </article>
        <section className={styles.commentsForm}>
          <h2>Deixar um comentário</h2>
          <form onSubmit={() => {}}>
            <Textarea />
            <button className={styles.button}>Enviar comentário</button>
          </form>
        </section>
        <section className={styles.commentsContainer}>
          <h2>Todos os Comentários</h2>
          <article className={styles.comments}>
            <div className={styles.profileComment}>
              <div className={styles.profileInfo}>
                <p>Image</p>
                <p>Name</p>
              </div>
              <p className={styles.comment}>cool</p>
            </div>
            <button className={styles.trashButton}>
              <FaTrash size={18} color="#ea3140" />
            </button>
          </article>
        </section>
      </section>
    </main>
  );
}
