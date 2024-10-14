// components/Layout.js
import Header from './Header';
import styles from './styles/Layout.module.css';

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <main className={styles.main}>{children}</main>
        </>
    );
}
