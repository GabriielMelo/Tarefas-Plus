import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./styles.module.css";
export default function Header() {
  const { data: session, status } = useSession();
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
          {session?.user && (
            <Link href={"/dashboard"}>
              <span className={styles.link}>Meu Painel</span>
            </Link>
          )}
        </nav>
        {status === "loading" ? (
          <></>
        ) : session ? (
          <button className={styles.headerButton} onClick={() => signOut()}>
            Olá {session?.user?.name}
          
          </button>
        ) : (
          <button
            className={styles.headerButton}
            onClick={() => signIn("google")}
          >
            Acessar
          </button>
        )}
      </section>
    </header>
  );
}
