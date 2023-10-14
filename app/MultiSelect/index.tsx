import React, { useEffect, useState } from 'react';
import { Check, ChevronDown } from 'react-feather';
import styles from './page.module.scss';

export default function MultiSelect({
	title,
	className,
	opts,
	optsToMatch,
	saveSelection,
	disableChanges = false,
}) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		document.addEventListener('click', close);
		return () => document.removeEventListener('click', close);
	}, []);

	function close(e) {
		if (!e.target.closest('.multiSelect')) setIsOpen(false);
	}

	return (
		<div className={`${className} multiSelect ${styles.multiSelect} ${isOpen ? styles.isOpen : ''} noMobile`}>
			<button
				className={styles.multiSelectTitle}
				onClick={() => setIsOpen(!isOpen)}
			>
				<span>{title} ({optsToMatch.length})</span> <ChevronDown size={16} />
			</button>
			<div className={styles.multiSelectOptions}>
				{opts.map((opt, i) =>
					<label
						key={`label${opt.id}`}
						className={`${styles.opt} ${optsToMatch.includes(opt.id) ? styles.isSelected : ''}`}
					>
						<span>
							<input
								type='checkbox'
								id={opt.id}
								name={opt.data.name}
								onChange={saveSelection}
								disabled={disableChanges}
							/>
							{opt.data.name}
						</span>
						{optsToMatch.includes(opt.id) && <Check size={16} />}
					</label>
				)}
			</div>
		</div>
	);
}
