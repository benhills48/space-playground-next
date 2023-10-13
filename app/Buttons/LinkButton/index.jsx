import React from 'react';
import { Link } from 'react-router-dom';
import styles from './page.module.scss';

export default function LinkButton({
	url,
	wrapperCn,
	className,
	children,
}) {
	return (
		<Link to={url ?? ''} className={wrapperCn}>
			<div className={className}>
					{children}
			</div>
		</Link>
	);
}
