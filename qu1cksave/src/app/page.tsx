import styles from "./page.module.css";
import Link from 'next/link'

export default function Home() {
  return (
    <main className={styles.main}>
      {/* TODO: Complete the unauthenticated home page (also called a marketing page) */}
      <Link href="/login">
        Login
      </Link>
    </main>
  );
}
