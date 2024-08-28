import Textarea from "@/components/textarea";
import Head from "next/head";
import styles from "./styles.module.css";

export default function Dashboard() {
  return (
    <main className={styles.container}>
      <Head>
        <title>Meu Painel de Tarefas</title>
      </Head>
      <section className={styles.content}>
        <article className={styles.contentForm}>
          <h1 className={styles.title}>Qual a sua Tarefa?</h1>
          <form>
            <Textarea 
            placeholder="Digite sua tarefa..."
            />
            <div className={styles.checkboxArea}>
              <input type="checkbox" className={styles.checkbox}/>
              <label>Deixar a tarefa pública?</label>
            </div>
            <button className={styles.button}>Registrar</button>
          </form>
        </article>
      </section>
    </main>
  );
}
