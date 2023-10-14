'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import EasierAuth from '../utils/auth/index';
import Button from './Buttons/index';
import styles from './page.module.scss';
import clock from '../public/loader--clock.svg';
import Header from "./Header/index";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userDoc, editUserDoc] = useState({});

    const easyAuth = new EasierAuth(
        setLoading,
        setUserId,
        setUserName,
        setUserEmail,
        editUserDoc,
    );
    const isSignedIn = easyAuth.getIsSignedIn(userId, userEmail);
    const isAdmin = easyAuth.getIsAdmin(userId, userEmail);

    useEffect(() => {
        return () => easyAuth.onChange();
    }, []);

    return (
        <>
            <Header
                db={easyAuth.db}
                userName={userName}
                userEmail={userEmail}
                isSignedIn={isSignedIn}
                isAdmin={isAdmin}
                doSignIn={easyAuth.doSignIn}
                doSignOut={easyAuth.doSignOut}
            />
            <main className={styles.main}>
                {loading ?
                    <Image
                        priority
                        src={clock}
                        alt="loading"
                    />
                : isSignedIn ?
                    'hi'
                :
                    <Button
                        className={styles.signInMessage}
                        onClick={easyAuth.doSignIn}
                    >
                        If you're meant to be here... sign in
                    </Button>
                }
            </main>
        </>
    );
}
