import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'react-feather';
import styles from './page.module.scss';

export default function DropdownMenu({
	title,
	className,
	opts,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const selected = useRef(-1);
	const buttonRef = useRef(null);
	const menuRef = useRef(null);

	useEffect(() => {
		document.addEventListener('click', handleDocumentClick);
		return () => document.removeEventListener('click', handleDocumentClick);
	}, []);

	function close() {
		selected.current = -1;
		setIsOpen(false);
	}

	function handleDocumentClick(e) {
		if (!e.target.closest('.dropdown')) {
			close();
		}
	}

	function checkKey(e) {
		if (e.key === ('Escape' || 'Enter' || 'Space')) {
			e.preventDefault();
		}

		switch(e.key) {
			case 'ArrowDown':
				next(e);
				break;
			case 'ArrowUp':
				prev(e);
				break;
			case 'Tab':
				isOpen && next(e);
				break;
			case 'Escape':
				e.target.blur();
				setIsOpen(false);
				break;
			case 'Space':
			case 'Enter':
				console.log('enter');
				break;
			default:
				e.preventDefault();
		}
	}

	function prevNext() {
		selected.current === -1
			? buttonRef.current.focus()
			: menuRef.current.children[selected.current].querySelector('a').focus();
	}

	function next(e) {
		e.preventDefault();
		selected.current < menuRef.current.children.length - 1
			? selected.current++
			: selected.current = -1;
		prevNext();
	}

	function prev(e) {
		e.preventDefault();
		selected.current > -1
			? selected.current--
			: selected.current = menuRef.current.children.length - 1;
		prevNext();
	}

	return (
		<nav
			className={`${className} dropdown ${styles.dropdown} ${isOpen ? styles.isOpen : ''}`}
			aria-label='Browse by category'
			onKeyDown={checkKey}
		>
			<button
				ref={buttonRef}
				type='button'
				aria-expanded={`${isOpen}`}
				aria-controls='category-list'
				className={styles.dropdownTitle}
				onClick={() => setIsOpen(!isOpen)}
			>
				<span>{title}</span>
				<ChevronDown size={16} />
			</button>
			<ul ref={menuRef} id='category-list' className={styles.dropdownOptions}>
				{opts.map(opt =>
					<li key={`dropdown${opt.id}`}>
						<Link
							href={`/category/${opt.id}`}
							className={`${styles.opt} ${styles.optLink}`}

						>
							{opt.data.name} ({opt.data.all.length})
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
}
