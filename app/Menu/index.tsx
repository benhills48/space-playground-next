'use client';
import React, { useEffect, useState } from 'react';
import { PenTool, LogIn, LogOut } from 'react-feather';
import Button from '../Buttons';
import LinkButton from '../Buttons/LinkButton';
import styles from './page.module.scss';

export default function Menu({
	userName,
	userEmail,
	isSignedIn,
	isAdmin,
	doSignIn,
	doSignOut,
}) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		document.addEventListener('click', close);
		return () => document.removeEventListener('click', close);
	}, []);

	function close(e) {
		if (!e.target.closest('.menu')) {
			setIsOpen(false);
		}
	}

	function checkKey(e) {
		if (e.key === 'Escape') {
			setIsOpen(false);
		}
	}

	return (
		<nav
			className={`menu ${styles.menu}`}
			onKeyDown={checkKey}
		>
			<div
				className={`modalUnderlay ${styles.modalUnderlay}${isOpen ? ' show' : ''}`}
				onClick={() => setIsOpen(false)}
			/>

			<Button
				className={styles.menuBtn}
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className={`${styles.burger} ${isOpen ? styles.isOpen : ''}`}>
					<svg width='100%' height='100%' viewBox='0 0 26 24'>
						<rect y='0' />
						<rect y='10' />
						<rect y='20' />
					</svg>
				</div>
			</Button>
			<div className={`${styles.menuDropdown} ${isOpen ? styles.isOpen : ''} imageAndText`}>
				{isAdmin &&
					<div className={styles.menuBlock}>
						<LinkButton
							url='/pen'
							className={`button penNew ${styles.menuOpt} imageAndText`}
						>
							<PenTool size={16} strokeWidth={1.4} />
							<span>new pen</span>
						</LinkButton>
					</div>
				}
				<div className={styles.menuBlock}>
					{isSignedIn ?
						<>
							<Button
								wrapperCn={styles.menuOpt}
								className='button'
								onClick={doSignOut}
							>
								<LogOut size={16} strokeWidth={1.2} />
								<span>sign out</span>
							</Button>
							{userName && userEmail &&
								<span className={`${styles.menuOpt} ${styles.userInfo}`}>
									<p>signed in as {userName}</p>
									<p>{userEmail}</p>
								</span>
							}
						</>
					:
						<Button
							wrapperCn={styles.menuOpt}
							className='button'
							onClick={doSignIn}
						>
							<LogIn size={16} strokeWidth={1.2} />
							<span>sign in</span>
						</Button>
					}
				</div>
			</div>
		</nav>
	);
}
