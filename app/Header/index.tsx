import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { collection, getDocs, query } from 'firebase/firestore';
import Logo from '../SVG/logo';
import Title from '../Title';
import Menu from '../Menu';
import DropdownMenu from '../MultiSelect/dropdownMenu';
import styles from './page.module.scss';

export default function Header({
    db,
    userName,
    userEmail,
    isSignedIn,
    isAdmin,
    doSignIn,
    doSignOut,
}) {
    const pathname: string = usePathname();
    const [cats, setCats] = useState([]);

    useEffect(() => {
        isSignedIn && !pathname.includes('pen')
            ? getCats()
            : setCats([]);
    }, [isSignedIn]);

    async function getCats(): Promise<void> {
        const catsToSet = [];
        const querySnapshot = await getDocs(query(collection(db, 'cats')));
        querySnapshot.forEach(doc => catsToSet.push({ id: doc.id, data: doc.data() }));
        setCats(catsToSet.sort((a, b) => a.data.name > b.data.name));
    }

    return (
        <>
            <header className={styles.header}>
                <Title>
                    <Logo size={36} />
                </Title>
                <Menu
                    userName={userName}
                    userEmail={userEmail}
                    isSignedIn={isSignedIn}
                    isAdmin={isAdmin}
                    doSignIn={doSignIn}
                    doSignOut={doSignOut}
                />
            </header>
            {cats.length ?
                <DropdownMenu
                    title='browse by category'
                    className={`categoryDropdown`}
                    opts={cats.filter(o => o.data.all.length > 0)}
                /> : <></>
            }
        </>
    );
}
