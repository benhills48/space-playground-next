import React from 'react';
import Link from 'next/link';
import styles from './page.module.scss';

export default function LinkButton({
	url,
	wrapperCn,
	className,
	children,
}) {
	return (
		<Link href={url ?? ''} className={wrapperCn}>
			<div className={className}>
					{children}
			</div>
		</Link>
	);
}
