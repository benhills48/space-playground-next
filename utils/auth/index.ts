import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export default class EasierAuth {
    constructor(
        public setLoading: React.Dispatch<React.SetStateAction<boolean>>,
        public setUserId: React.Dispatch<React.SetStateAction<string>>,
        public setUserName: React.Dispatch<React.SetStateAction<string>>,
        public setUserEmail: React.Dispatch<React.SetStateAction<string>>,
        public editUserDoc: React.Dispatch<React.SetStateAction<{}>>,
        public firebaseApp = initializeApp(firebaseConfig),
        public provider = new GoogleAuthProvider(),
        public auth = getAuth(),
        public readonly db = getFirestore(firebaseApp),
    ) {
        this.doSignIn = this.doSignIn.bind(this);
        this.doSignOut = this.doSignOut.bind(this);
        this.doubleCheckUser = this.doubleCheckUser.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    getIsSignedIn(id: string, email: string) {
        return id && email && id !== '' && email !== '';
    }

    getIsAdmin(id: string, email: string) {
        return this.getIsSignedIn(id, email) && email.includes('@space48.com');
    }

    setUser(id: string, name: string, email: string) {
        this.setUserId(id);
        this.setUserName(name);
        this.setUserEmail(email);
    }

    doSignIn() {
        this.setLoading(true);
        signInWithPopup(this.auth, this.provider).then(result => {
            const { uid, displayName, email } = result.user;
            this.setUser(uid, displayName ?? '', email ?? '');
            this.checkUser(uid, displayName ?? '', email ?? '');
            this.setLoading(false);
        }).catch(error => {
            console.error(error.code, error.message);
        });
    }

    doSignOut() {
        this.setLoading(true);
        signOut(this.auth).then(() => {
            this.setUser('', '', '');
            this.setLoading(false);
        }).catch(error => {
            console.warn(error);
        });
    }

    async checkUser(id: string, name: string, email: string) {
        if (id && name && email) {
            if (this.getIsAdmin(id, email)) {
                this.setUser(
                    this.auth.currentUser.uid,
                    this.auth.currentUser.displayName ?? '',
                    this.auth.currentUser.email ?? '',
                );
                const docRef = doc(this.db, 'users', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const newUserDoc = docSnap.data();
                    this.editUserDoc(newUserDoc);
                } else {
                    await this.createUser(id, name, email);
                }
            } else {
                console.warn('not admin');
            }
        } else {
            console.warn('missing id or name or email');
        }
    }

    async doubleCheckUser(id: string) {
        if (id) {
            const docRef = doc(this.db, 'users', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const newUserDoc = docSnap.data();
                this.editUserDoc(newUserDoc);
            }
        }
    }

    async createUser(id: string, name: string, email: string) {
        console.log('creating user...');
        const userRef = collection(this.db, 'users');
        await setDoc(doc(userRef, id), {
            name: name,
            email: email,
            pens: [],
            bookmarks: [],
        });
        this.checkUser(id, name, email).then(data => {
            console.log('user created!');
        });
    }

    onChange() {
        this.auth.onAuthStateChanged(() => {
            if (this.auth.currentUser) {
                this.setUser(
                    this.auth.currentUser.uid,
                    this.auth.currentUser.displayName,
                    this.auth.currentUser.email
                );
                this.checkUser(
                    this.auth.currentUser.uid,
                    this.auth.currentUser.displayName,
                    this.auth.currentUser.email
                );
            }
        });
    }
}
