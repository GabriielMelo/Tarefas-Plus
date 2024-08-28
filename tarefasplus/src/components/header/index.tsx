import Link from "next/link";
import styles from "./styles.module.css";
export default function Header() {
  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.navBar}>
          <Link href={"/"}>
            <h1>
              Tarefas
              <span className={styles.logo}>+</span>
            </h1>
          </Link>
          <Link href={"/dashboard"}>
            <span className={styles.link}>Meu Painel</span>
          </Link>
        </nav>
        <button className={styles.headerButton}>Acessar</button>
      </section>
    </header>   
  );
}
