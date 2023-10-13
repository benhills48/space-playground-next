'use client';
import React from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import clock from '../public/loader--clock.svg';
import Button from './Buttons/index';
import styles from './page.module.scss';

export default function Home() {
    return (
        <SessionProvider>
            <Main />
        </SessionProvider>
    )
}

function Main() {
    const { data, status } = useSession();
    return (
        <main className={styles.main}>
            {status === 'loading' ?
                <Image
                    priority
                    src={clock}
                    alt="Follow us on Twitter"
                />
            : status === 'authenticated' ?
                <div>
                    <h1> hi {data.user.name}</h1>
                    <img src={data.user.image} alt={data.user.name + ' photo'}/>
                    <button onClick={signOut}>sign out</button>
                </div>
            :
                <Button
                    className={styles.signInMessage}
                    onClick={() => signIn('google')}
                >
                    If you're meant to be here... sign in
                </Button>
            }
        </main>
    );
}
