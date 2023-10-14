import React from 'react';
import Link from 'next/link';
import styles from './page.module.scss';

export default function Title({ children }) {
    return (
        <Link href='/'>
            <h1 className={styles.title}>
                {children}
            </h1>
        </Link>
    );
}
