import React from "react";
import classes from '../../sass/components/UI/Modal.module.scss';
import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Card from "./Card";

type Props = {
    children?: React.ReactNode,
	title?: string,
	message?: string,
    className?: string,
	onCloseClick: () => void,
	onDelete?: () => void,
};

const Backdrop: React.FC<Props> = (props) => {
	return <div className={classes.backdrop} onClick={props.onCloseClick}></div>
}

const Overlay: React.FC<Props> = (props) => {

	const handleDelete = () => {
		if (props.onDelete)
			props.onDelete();
		props.onCloseClick();
	}


	return (
		<Card className={classes.modal}>
			<header className={classes.header}>
				<h1>{props.title}</h1>
			</header>
			<div className={classes.content}>
				<p>{props.message}</p>
			</div>
			<footer className={classes.actions}>
				<button className={classes["button-cancel"]} onClick={props.onCloseClick}>Cancel</button>
				<button className={classes.button} onClick={handleDelete}>Delete</button>
			</footer>
		</Card>
	);
}

const portalOverlays = document.getElementById('overlays');
const portalBackdrop = document.getElementById('backdrop');

const Modal: React.FC<Props> = (props) => {

	return (
		<Fragment>
			{portalBackdrop && ReactDOM.createPortal(<Backdrop 
							onCloseClick={props.onCloseClick} />, portalBackdrop)}
			{portalOverlays && ReactDOM.createPortal(<Overlay 
							title={props.title}
							message={props.message}
							onCloseClick={props.onCloseClick}
							onDelete={props.onDelete}>{props.children}</Overlay>, portalOverlays)}
		</Fragment>
	)
}

export default Modal;