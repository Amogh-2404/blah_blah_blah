// components/Header.js
import Link from 'next/link';
import styles from './styles/Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <h1 className={styles.logo}>Logistics Platform</h1>
            <nav>
                <ul className={styles.navList}>
                    <li>
                        <Link href="/user-dashboard">
                            User Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link href="/driver-dashboard">
                            Driver Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link href="/login">
                            Login
                        </Link>
                    </li>
                    <li>
                        <Link href="/register">
                            Register
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
